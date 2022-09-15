-- creates clean database for geluid 
DROP USER IF EXISTS 'schrijver'@'localhost';
DROP USER IF EXISTS 'lezer'@'localhost';
DROP DATABASE IF EXISTS geluid;
CREATE DATABASE geluid;
USE geluid;
CREATE TABLE sensor (
  id INT(11) NOT NULL AUTO_INCREMENT,
  naam VARCHAR(45),
  eenheid VARCHAR(45),
  PRIMARY KEY (id)
); 
CREATE TABLE meting (
  id INT(11) NOT NULL AUTO_INCREMENT,
  waarde FLOAT DEFAULT NULL,
  tijd TIMESTAMP,
  classroom VARCHAR(45),
  PRIMARY KEY (id)
  ); 
CREATE USER 'schrijver'@'%' IDENTIFIED BY 'WindesheimICTHeeftZiektes!';
CREATE USER 'lezer'@'%' IDENTIFIED BY 'WindesheimICTHeeftZiektes!';
GRANT INSERT ON geluid.meting TO 'schrijver'@'%';
GRANT SELECT ON geluid.sensor TO 'schrijver'@'%';
GRANT SELECT ON geluid.* TO 'lezer'@'%';
