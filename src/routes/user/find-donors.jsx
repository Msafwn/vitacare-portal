import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useGetCurrentUserQuery, useGetDonorsQuery } from "@/features/users/userApiSlice";
// Removed mockUser
import { MapPin, SearchX, ShieldCheck } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import SearchBar from "@/components/blood/SearchBar";
import Select from "@/components/blood/Select";
import Avatar from "@/components/blood/Avatar";
import StatusBadge from "@/components/blood/StatusBadge";
import EmptyState from "@/components/blood/EmptyState";
import Pagination from "@/components/blood/Pagination";
import { CardSkeleton } from "@/components/blood/Skeleton";
import { BLOOD_GROUPS, CITIES, formatDate } from "@/data/mock";

const PAGE_SIZE = 6;

function FindDonors() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get("query") || "";
  const group = searchParams.get("group") || "";
  const city = searchParams.get("city") || "";
  const only = searchParams.get("only") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const updateParams = (updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      if (updates.page === undefined) next.delete("page");
      return next;
    }, { replace: true });
  };

  const setQuery = (val) => updateParams({ query: val });
  const setGroup = (val) => updateParams({ group: val });
  const setCity = (val) => updateParams({ city: val });
  const setOnly = (val) => updateParams({ only: val });
  const setPage = (val) => updateParams({ page: val.toString() });
  
  // Create a debounced query string so we don't spam the API on every keystroke
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: response } = useGetCurrentUserQuery();
  const currentUser = response?.data || {};
  const isDonor = currentUser?.isDonor;

  const { data: donorsResponse, isLoading } = useGetDonorsQuery({
    name: debouncedQuery || undefined,
    bloodGroup: group || undefined,
    city: city || undefined,
    availability: only || undefined,
  });

  const results = donorsResponse?.data || [];

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function reset() {
    setSearchParams(new URLSearchParams());
  }

  return (
    <UserLayout>
      <PageHeader
        title="Find donors"
        description={`${results.length} verified donors match your filters.`}
        actions={
          <div className="flex gap-3">
            {!isDonor && (
              <Button as="link" to="/become-donor" variant="soft">
                Become a donor
              </Button>
            )}
            <Button as="link" to="/requests/new" variant="secondary">
              Create request
            </Button>
          </div>
        }
      />

      <div className="surface mb-6 grid gap-3 p-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
        <SearchBar
          placeholder="Search by donor name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select
          options={BLOOD_GROUPS}
          placeholder="All blood groups"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        />
        <Select
          options={CITIES}
          placeholder="All cities"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Select
          options={[
            { value: "available", label: "Available" },
            { value: "unavailable", label: "Unavailable" },
          ]}
          placeholder="Any status"
          value={only}
          onChange={(e) => setOnly(e.target.value)}
        />
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : current.length === 0 ? (
        <div className="surface">
          <EmptyState
            icon={SearchX}
            title="No donors found"
            description="Try widening your filters or search a different city."
            action={
              <Button variant="soft" onClick={reset}>
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {current.map((d) => (
              <div key={d.id} className="surface p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={d.name} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
                      {d.name}
                      {d.verified && <ShieldCheck className="h-4 w-4 text-success" />}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {d.area}, {d.city}
                    </p>
                  </div>
                  <span className="rounded-lg bg-primary-soft px-2.5 py-1 text-sm font-semibold text-primary">
                    {d.bloodGroup}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last donated {formatDate(d.lastDonation)}</span>
                  <StatusBadge status={d.status} />
                </div>
                <Link
                  to={`/donors/${d.id}`}
                  className="mt-4 flex h-10 items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  View profile
                </Link>
              </div>
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            total={results.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </>
      )}
    </UserLayout>
  );
}

export default FindDonors;
