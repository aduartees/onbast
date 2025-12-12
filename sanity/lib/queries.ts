import { defineQuery } from "next-sanity";

export const SERVICES_QUERY = defineQuery(`*[_type == "service"] | order(_createdAt asc) {
  _id,
  title,
  description,
  icon,
  "imageUrl": image.asset->url,
  colSpan
}`);
