-- Đợt giao diện: loại chiến dịch, trường editor, điều khoản, khu vực, tắt email, nguồn theo dõi
alter table chien_dich add column if not exists loai_chien_dich  text not null default 'tu_do';
alter table chien_dich add column if not exists tieu_de_trang    text not null default '';
alter table chien_dich add column if not exists nut_cta          text not null default '';
alter table chien_dich add column if not exists mau_nen          text not null default '';
alter table chien_dich add column if not exists noi_dung_dong    text not null default '';
alter table chien_dich add column if not exists dieu_khoan_tieu_de text not null default '';
alter table chien_dich add column if not exists dieu_khoan       text not null default '';
alter table chien_dich add column if not exists khu_vuc          text not null default '';
alter table chien_dich add column if not exists email_tat        jsonb not null default '{}';
alter table chien_dich add column if not exists ma_header_dang_ky text not null default '';
alter table chien_dich add column if not exists ma_header_chia_se text not null default '';

create table if not exists theo_doi_nguon (
  id            serial primary key,
  chien_dich_id int not null references chien_dich(id) on delete cascade,
  ten           text not null,
  keyword       text not null,
  tao_luc       timestamptz not null default now(),
  unique (chien_dich_id, keyword)
);
