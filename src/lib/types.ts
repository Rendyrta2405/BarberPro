export interface Service {
   id: number;
   name: string;
   price: number;
   duration: number;
   description: string;
   is_active: boolean;
}

export interface Barber {
   id: number;
   name: string;
   title: string;
   is_active: boolean;
}

export interface WorkingHour {
   id: number;
   barber_id: number;
   weekday: number;
   start_time: string;
   end_time: string;
}