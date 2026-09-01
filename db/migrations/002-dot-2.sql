-- Đợt 2: tuỳ biến trang, share message per kênh, custom fields, webhook, cách chọn winner
alter table chien_dich add column if not exists anh_cover   text not null default '';
alter table chien_dich add column if not exists logo_url    text not null default '';
alter table chien_dich add column if not exists mau_chinh   text not null default '#2563eb';
alter table chien_dich add column if not exists video_url   text not null default '';
alter table chien_dich add column if not exists og_tieu_de  text not null default '';
alter table chien_dich add column if not exists og_mo_ta    text not null default '';
alter table chien_dich add column if not exists og_anh      text not null default '';
alter table chien_dich add column if not exists loi_moi     jsonb not null default '{}';
alter table chien_dich add column if not exists truong_them jsonb not null default '[]';
alter table chien_dich add column if not exists webhook_url text not null default '';
alter table nguoi_tham_gia add column if not exists du_lieu_them jsonb not null default '{}';
alter table boc_tham add column if not exists cach text not null default 'trong_so';
