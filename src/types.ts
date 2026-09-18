export interface Student {
  nama: string;
  username: string;
  kelas?: string;
  cita_cita?: string;
}

export interface HabitEntry {
  tgl: string;
  detail1: string;
  detail2?: string;
}

export type HabitsRecord = Record<string, HabitEntry[]>;

export interface SchoolSettings {
  pemerintah: string;
  nama_sekolah: string;
  alamat: string;
  logo_daerah: string;
  logo_sekolah: string;
  nama_guru: string;
  nip_guru: string;
  nama_kepsek: string;
  nip_kepsek: string;
  tempat_ttd: string;
}

export interface TrackingLog {
  time: string;
  nama: string;
  type: string;
  ip: string;
  lat: string;
  lng: string;
  date: string;
}
