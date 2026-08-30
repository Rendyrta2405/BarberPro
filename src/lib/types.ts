export interface Service {
   id: string;
   name: string;
   price: number;
   duration: number;
   description: string;
}

export interface Barber {
   id: string;
   name: string;
   title: string;
   is_active: boolean;
}