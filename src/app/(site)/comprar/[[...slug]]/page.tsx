import type { Metadata } from "next";
import { OperationLanding, operationMetadata } from "@/components/catalog/OperationLanding";

type Props = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return operationMetadata("sale", slug);
}

export default async function ComprarPage({ params, searchParams }: Props) {
  const { slug } = await params;
  return <OperationLanding operation="sale" segments={slug} searchParams={searchParams} />;
}
