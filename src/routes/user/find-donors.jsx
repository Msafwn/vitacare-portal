import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
import { BLOOD_GROUPS, CITIES, donors, formatDate } from "@/data/mock";

const PAGE_SIZE = 6;

function FindDonors() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [city, setCity] = useState("");
  const [only, setOnly] = useState("");
  const [page, setPage] = useState(1);
  const [loading] = useState(false);
  const { isDonor } = useSelector(state => state.user);

  const results = useMemo(
    () =>
      donors.filter(
        (d) =>
          (!query || d.name.toLowerCase().includes(query.toLowerCase())) &&
          (!group || d.bloodGroup === group) &&
          (!city || d.city === city) &&
          (!only || d.status === only),
      ),
    [query, group, city, only],
  );

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function reset() {
    setQuery("");
    setGroup("");
    setCity("");
    setOnly("");
    setPage(1);
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
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <Select
          options={BLOOD_GROUPS}
          placeholder="All blood groups"
          value={group}
          onChange={(e) => {
            setGroup(e.target.value);
            setPage(1);
          }}
        />
        <Select
          options={CITIES}
          placeholder="All cities"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setPage(1);
          }}
        />
        <Select
          options={[
            { value: "available", label: "Available" },
            { value: "unavailable", label: "Unavailable" },
          ]}
          placeholder="Any status"
          value={only}
          onChange={(e) => {
            setOnly(e.target.value);
            setPage(1);
          }}
        />
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
      </div>

      {loading ? (
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
                  to="/donors/$donorId"
                  params={{ donorId: d.id }}
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
