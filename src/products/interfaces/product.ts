import { Types } from "mongoose";
import { Variant } from "./variant";

export interface Products {
  _id: Types.ObjectId;
  docId: string;
  fullData: null;
  data: {
    name: string;
    description: string;
    vendorId: string;
    manufacturerId: string;
    storefrontPriceVisibility: string;
    variants: Variant[];
    options: Array<{
      id: string;
      name: string;
      dataField: null;
      values: Array<{
        id: string;
        name: string;
        value: string;
      }>;
    }>;
    availability: string;
    isFragile: boolean;
    published: string;
    isTaxable: boolean;
    images: Array<{
      fileName: string;
      cdnLink: string | null;
      i: number;
      alt: string | null;
    }>;
    categoryId: string;
  };
}
