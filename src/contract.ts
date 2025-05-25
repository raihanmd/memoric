import type { SetImageParams, TImages, TSchema } from "./types";
import { NearBindgen, near, UnorderedMap, call, Vector } from "near-sdk-js";

@NearBindgen({})
class HelloNear {
  static schema: TSchema = {
    images: {
      class: UnorderedMap,
      value: { class: Vector, value: "string" },
    },
  };

  images: TImages = new UnorderedMap<Vector<string>>("images");

  @call({})
  get_image() {
    near.log(near.storageUsage());
    return this.images.get(near.signerAccountId()).toArray() ?? [];
  }

  @call({})
  set_image(payload: SetImageParams): void {
    near.log(payload);

    let images = this.images.get(near.signerAccountId());

    if (!images) {
      images = new Vector<string>("images");
    } else if (images.length >= 10) {
      near.log(`Image limit reached for ${near.signerAccountId()}`);
      throw new Error("Image limit reached");
    }
    images.push(payload.image_cid);

    this.images.set(near.signerAccountId(), images);

    near.log(`Image set for ${near.signerAccountId()}: ${payload.image_cid}`);
    near.log(near.storageUsage());
  }
}
