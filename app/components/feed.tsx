import "server-only";

import { Error } from "@/components/error.server";

import { getNFTs } from "@/services/nfts/trending";

import { FeedsContainer } from "./feeds-container";
import { FeedRangeFilter } from "./filters";

type FeedProps = {
  title: string;
  category?: string;
  range?: string;
  type: string;
  q?: string;
};

export async function Feed(props: FeedProps) {
  const { category, range, type, q } = props;

  const res = await getNFTs({
    sortMode: type,
    unit: q ? 50 : 20,
    category: category === "All" ? null : category,
    range,
    search: q
  });

  if (!res.success) {
    return (
      <div className="flex min-h-[calc(100vh-48px-72px-32px-80px)] w-full items-center justify-center">
        <Error error={res.error} title="Oops! Can not load feeds" />
      </div>
    );
  }

  return (
    <div className="h-auto w-full">
      <div className="flex h-auto w-full items-center justify-between">
        <Title title={props.type} />
        <div className="flex size-auto items-center justify-center gap-4">
          <FeedRangeFilter range={range} />
        </div>
      </div>

      <div className="mt-10 h-auto w-full">
        <FeedsContainer
          isSearch={q ? true : false}
          data={res.data.result}
          type={type}
          range={range}
          q={q}
          category={category}
        />
      </div>
    </div>
  );
}

function Title(props: { title: string }) {
  const { title } = props;
  if (title === "trends") {
    return <h1 className="text-4xl font-semibold">Most Viewed</h1>;
  }

  if (title === "locked") {
    return <h1 className="text-4xl font-semibold">TOKEN GATED</h1>;
  }

  return <h1 className="text-4xl font-semibold">{title}</h1>;
}
