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
  sortBy?: string;
  base?:string;
  tab?:string;
};

export async function Categories(props: Props) {
 
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
  const { category, type, title, range, sortBy, base ,tab} = props;
 
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
        className="flex items-center justify-start gap-2"
      >
        <CarouselPrevious className="scale-75" />
        <CarouselContent>
          <CarouselItem className="basis-auto pl-4">
            <FeedRangeFilterMobile
              categories={categories}
              type={type}
              range={range}
              sortBy={sortBy}
              base={base}
              tab={tab}
            />
          </CarouselItem>
          <CarouselItem className="basis-auto">
            <CategoryButton
              isActive={isActive("All")}
              url={`${base??""}/${objectToGetParams({ category: "All", type, title, range,tab })}`}
            >
              All
            </CategoryButton>
          </CarouselItem>
          {categories.map((item, index) => (
            <CarouselItem key={index} className="basis-auto">
              <CategoryButton
                url={`${base??""}/${objectToGetParams({ category: item, type, title, range ,tab})}`}
                isActive={isActive(item)}
              >
                {item}
              </CategoryButton>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="scale-75" />
      </Carousel>
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="mr-5 flex w-full items-center gap-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="shimmer relative h-6 flex-1 rounded-full border border-gray-400 bg-gray-400 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark"
        />
      ))}
    </div>
  );
}
