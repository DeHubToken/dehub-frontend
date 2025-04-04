import "server-only";

import { Suspense } from "react";

import { ErrorBanner } from "@/components/error.server";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

import objectToGetParams from "@/libs/utils";

import { getCategories } from "@/services/categories";

import { CategoryButton } from "./category-button";
import { FeedRangeFilterMobile } from "./filters";

/* ----------------------------------------------------------------------------------------------- */

type Props = {
  category?: string;
  title?: string;
  range?: string;
  type?: string;
  q?: string;
  sort?: string;
  base?:string;
  tab?:string;
};

export async function Categories(props: Props) {
  if (props.type === "feed") return null;
  return (
    <div className="flex h-auto w-full items-center justify-between">
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesLoader {...props} />
      </Suspense>
    </div>
  );
}

async function CategoriesLoader(props: Props) {
  const categoriesRes = await getCategories();
  const { category, type, title, range, sort, base ,tab} = props;
 
  const isActive = (name: string) => category === name;

  if (!categoriesRes.success) {
    return <ErrorBanner error={categoriesRes.error} title="Oop!" />;
  }

  const categories = categoriesRes.data;

  return (
    <div className="h-auto w-full">
      <Carousel
        opts={{
          dragFree: true
        }}
        className="relative flex items-center justify-start gap-2"
      >
        <CarouselPrevious className="absolute left-0 top-1/2 z-[2] -translate-y-1/2" />
        <CarouselContent className="relative z-0 pl-16">
          <CarouselItem className="basis-auto">
            <FeedRangeFilterMobile
              categories={categories}
              type={type}
              range={range}
              sort={sort}
              base={base}
              tab={tab}
            />
          </CarouselItem>
          <CarouselItem className="basis-auto">
            <CategoryButton
              isActive={isActive("All")}
              scroll={tab==""}
              url={`${base ?? ""}/${objectToGetParams({ category: "All", type, title, range, tab })}`}
            >
              All
            </CategoryButton>
          </CarouselItem>
          {categories.map((item, index) => (
            <CarouselItem key={index} className="basis-auto">
              <CategoryButton
                scroll={tab==""}
                url={`${base ?? ""}/${objectToGetParams({ category: item, type, title, range, tab })}`}
                isActive={isActive(item)}
              >
                {item}
              </CategoryButton>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="absolute right-0 top-1/2 z-[2] -translate-y-1/2" />
      </Carousel>
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="mr-5 flex w-full items-center gap-4 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="shimmer relative h-8 min-w-[80px] max-w-[80px] flex-1 rounded-full border border-gray-400 border-theme-mine-shaft bg-gray-400 bg-theme-mine-shaft-dark"
        />
      ))}
    </div>
  );
}
