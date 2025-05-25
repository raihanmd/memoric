import { UnorderedMap, Vector } from "near-sdk-js";

export type TImages = UnorderedMap<Vector<string>>;

export type TSchema = {
  images: {
    class: typeof UnorderedMap;
    value: { class: typeof Vector; value: "string" };
  };
};

export type SetImageParams = {
  image_cid: string;
};
