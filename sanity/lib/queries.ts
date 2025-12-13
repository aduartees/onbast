import { defineQuery } from "next-sanity";

export const SERVICES_QUERY = `*[_type == "service"] | order(_createdAt asc) {
  _id,
  title,
  description,
  icon,
  "imageUrl": image.asset->url,
  colSpan
}`;

export const PROJECTS_QUERY = `*[_type == "project"] | order(_createdAt desc) {
  _id,
  title,
  description,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  tags,
  link
}`;
