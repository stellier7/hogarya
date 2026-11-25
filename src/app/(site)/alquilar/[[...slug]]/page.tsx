import type { Metadata } from "next";
import { OperationLanding, operationMetadata } from "@/components/catalog/OperationLanding";

type Props = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return operationMetadata("rent", slug);
}

export default async function AlquilarPage({ params, searchParams }: Props) {
  const { slug } = await params;
  return <OperationLanding operation="rent" segments={slug} searchParams={searchParams} />;
}
