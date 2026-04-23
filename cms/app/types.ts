export type Category = {
  key: string;
  nameEn: string;
  nameMy: string;
  global?: boolean;
  subcategories: Subcategory[];
}

export type Subcategory = {
  key: string;
  nameEn: string;
  nameMy: string;
}
