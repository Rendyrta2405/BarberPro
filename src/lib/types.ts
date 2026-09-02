export interface Service {
   id: number;
   name: string;
   price: number;
   duration: number;
   description: string;
   is_active: boolean;
   image_url: string | null;
}

export interface Barber {
   id: number;
   name: string;
   title: string;
   is_active: boolean;
   photo_url: string | null;
   bio: string | null;
}

export interface WorkingHour {
   id: number;
   barber_id: number;
   weekday: number;
   start_time: string;
   end_time: string;
}