create database jpa_shop character set utf8;

create user 'shop_server'@'localhost' identified by 'shop-server-password1234';
create user 'shop_server'@'%' identified by 'shop-server-password1234';

grant all privileges on jpa_shop.* to 'shop_server'@'localhost';
grant all privileges on jpa_shop.* to 'shop_server'@'%';

use jpa_shop;

create table MEMBER(
  member_id bigint auto_increment,
  name varchar(30),
  city varchar(30),
  street varchar(100),
  zipcode varchar(30),

  primary key(member_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table ORDERS(
  order_id bigint auto_increment,
  member_id bigint,
  delivery_id bigint,
  orderdate datetime,
  status varchar(20),

  primary key(order_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table DELIVERY(
  delivery_id bigint auto_increment,
  status varchar(20),
  city varchar(30),
  street varchar(100),
  zipcode varchar(30),

  primary key(delivery_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table ORDER_ITEM(
  order_item_id bigint auto_increment,
  order_id bigint,
  item_id bigint,
  orderprice bigint,
  count int,

  primary key(order_item_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table ITEM(
  item_id bigint auto_increment,
  name varchar(100),
  price bigint,
  stockquantity int,
  item_type varchar(20),

  artist varchar(50),
  etc varchar(100),

  author varchar(100),
  isbn varchar(50),

  director varchar(100),
  actor varchar(100),

  primary key(item_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table CATEGORY_ITEM(
  category_id bigint,
  item_id bigint,

  primary key(category_id, item_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table CATEGORY(
  category_id bigint auto_increment,
  parent_id bigint,
  name varchar(100),

  primary key(category_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;