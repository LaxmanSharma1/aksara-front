import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "next-i18next";
import { get } from "@lib/api";
import DataCatalogue from "@data-catalogue/index";
import { SHORT_LANG } from "@lib/constants";
import { sortAlpha } from "@lib/helpers";

const CatalogueIndex: Page = ({
  query,
  collection,
  total,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata title={t("nav.catalogue")} description={""} keywords={""} />
      <DataCatalogue query={query} collection={collection} total={total} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/data-catalog/", { lang: SHORT_LANG[locale!], ...query });
  const collection = Object.entries(data.dataset).map(([key, item]: [string, unknown]) => [
    key,
    sortAlpha(item as Array<Record<string, any>>, "catalog_name"),
  ]);

  console.log(query);
  return {
    props: {
      ...i18n,
      query: query ?? {},
      total: data.total_all,
      collection,
    },
  };
};

export default CatalogueIndex;
