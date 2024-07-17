
export interface Variant {
    id: string;
    available: boolean;
    attributes: {
      packaging: string;
      description: string;
    };
    cost: number;
    currency: string;
    depth: null;
    description: string;
    dimensionUom: null;
    height: null;
    width: null;
    manufacturerItemCode: string;
    manufacturerItemId: string;
    packaging: string;
    price: number;
    volume: null;
    volumeUom: null;
    weight: null;
    weightUom: null;
    optionName: string;
    optionsPath: string;
    optionItemsPath: string;
    sku: string;
    active: boolean;
    images: Array<{
      fileName: string;
      cdnLink: string | null;
      i: number;
      alt: string | null;
    }>;
    itemCode: string;
  }