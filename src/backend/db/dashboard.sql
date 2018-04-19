-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 13, 2018 at 02:44 PM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 7.2.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dashboard`
--
CREATE DATABASE IF NOT EXISTS `dashboard` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `dashboard`;

-- --------------------------------------------------------

--
-- Table structure for table `activity`
--

CREATE TABLE `activity` (
  `id` int(6) UNSIGNED NOT NULL,
  `steps` mediumint(9) NOT NULL,
  `duration` smallint(6) NOT NULL,
  `time` datetime NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `user_id` int(6) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------
INSERT INTO `activity` (`id`, `steps`, `duration`, `time`, `is_read`, `user_id`) VALUES
(1, 3080, 40, '2018-04-01 10:00:00', 0, 1),
(3, 2455, 45, '2018-04-01 15:00:00', 0, 1),
(5, 3200, 60, '2018-04-02 12:00:00', 0, 1),
(6, 1800, 30, '2018-04-02 18:00:00', 0, 1),
(7, 2000, 35, '2018-04-03 08:00:00', 0, 1),
(9, 8000, 86, '2018-04-03 16:00:00', 0, 1),
(11, 4062, 60, '2018-04-04 12:00:00', 0, 1),
(12, 1680, 20, '2018-04-04 20:00:00', 0, 1),
(13, 2046, 30, '2018-04-05 07:00:00', 0, 1),
(14, 2044, 32, '2018-04-05 16:00:00', 0, 1),
(15, 4008, 60, '2018-04-06 09:00:00', 0, 1),
(16, 3608, 50, '2018-04-06 18:00:00', 0, 1),
(17, 2088, 32, '2018-04-07 12:00:00', 0, 1),
(18, 4600, 50, '2018-04-07 17:00:00', 0, 1),
(19, 3200, 40, '2018-04-08 12:00:00', 0, 1),
(20, 1005, 15, '2018-04-08 15:00:00', 0, 1),
(21, 800, 10, '2018-04-08 17:00:00', 0, 1),
(22, 5063, 80, '2018-04-09 12:00:00', 0, 1),
(23, 2001, 20, '2018-04-09 21:00:00', 0, 1),
(24, 4963, 60, '2018-04-10 09:00:00', 0, 1),
(26, 6300, 78, '2018-04-10 21:00:00', 0, 1),
(27, 1089, 15, '2018-04-11 11:00:00', 0, 1),
(28, 3012, 35, '2018-04-11 21:00:00', 0, 1),
(29, 2098, 21, '2018-04-12 11:00:00', 0, 1),
(30, 3500, 35, '2018-04-12 23:00:00', 0, 1),
(31, 1220, 20, '2018-04-13 11:00:00', 0, 1),
(33, 2400, 35, '2018-04-13 20:00:00', 0, 1),
(34, 1180, 15, '2018-04-14 11:00:00', 0, 1),
(35, 4000, 30, '2018-04-14 19:00:00', 0, 1);
--
-- Table structure for table `blood_sugar`
--

CREATE TABLE `blood_sugar` (
  `id` int(6) UNSIGNED NOT NULL,
  `value` float NOT NULL,
  `time` datetime NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `user_id` int(6) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------
INSERT INTO `blood_sugar` (`id`, `value`, `time`, `is_read`, `user_id`) VALUES
(1, '4.3', '2018-04-01 10:00:00', 0, 1),
(3, '4.8', '2018-04-01 15:00:00', 0, 1),
(5, '5.8', '2018-04-02 12:00:00', 0, 1),
(6, '4.7', '2018-04-02 18:00:00', 0, 1),
(7, '4.8', '2018-04-03 08:00:00', 0, 1),
(9, '4.2', '2018-04-03 16:00:00', 0, 1),
(11, '3.9', '2018-04-04 12:00:00', 0, 1),
(12, '5.3', '2018-04-04 20:00:00', 0, 1),
(13, '6.2', '2018-04-05 07:00:00', 0, 1),
(14, '4.0', '2018-04-05 16:00:00', 0, 1),
(15, '4.4', '2018-04-06 09:00:00', 0, 1),
(16, '4.3', '2018-04-06 18:00:00', 0, 1),
(17, '4.9', '2018-04-07 12:00:00', 0, 1),
(18, '3.8', '2018-04-07 17:00:00', 0, 1),
(19, '6.0', '2018-04-08 12:00:00', 0, 1),
(20, '5.6', '2018-04-08 15:00:00', 0, 1),
(21, '5.2', '2018-04-08 17:00:00', 0, 1),
(22, '4.9', '2018-04-09 12:00:00', 0, 1),
(23, '4.8', '2018-04-09 21:00:00', 0, 1),
(24, '5.7', '2018-04-10 09:00:00', 0, 1),
(26, '5.4', '2018-04-10 21:00:00', 0, 1),
(27, '5.0', '2018-04-11 11:00:00', 0, 1),
(28, '4.7', '2018-04-11 21:00:00', 0, 1),
(29, '4.8', '2018-04-12 11:00:00', 0, 1),
(30, '4.1', '2018-04-12 23:00:00', 0, 1),
(31, '6.1', '2018-04-13 11:00:00', 0, 1),
(33, '4.5', '2018-04-13 20:00:00', 0, 1),
(34, '5.5', '2018-04-14 11:00:00', 0, 1),
(35, '5.7', '2018-04-14 19:00:00', 0, 1);

--
-- Table structure for table `bp`
--

CREATE TABLE `bp` (
  `id` int(6) UNSIGNED NOT NULL,
  `systolic` smallint(6) NOT NULL,
  `diastolic` smallint(6) NOT NULL,
  `time` datetime NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `user_id` int(6) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------
INSERT INTO `bp` (`id`, `systolic`, `diastolic`, `time`, `is_read`, `user_id`) VALUES
(1, 128, 93, '2018-04-01 10:00:00', 0, 1),
(3, 124, 93, '2018-04-01 15:00:00', 0, 1),
(5, 125, 95, '2018-04-02 12:00:00', 0, 1),
(6, 118, 83, '2018-04-02 18:00:00', 0, 1),
(7, 119, 85, '2018-04-03 08:00:00', 0, 1),
(9, 125, 82, '2018-04-03 16:00:00', 0, 1),
(11, 130, 90, '2018-04-04 12:00:00', 0, 1),
(12, 128, 92, '2018-04-04 20:00:00', 0, 1),
(13, 122, 88, '2018-04-05 07:00:00', 0, 1),
(14, 134, 98, '2018-04-05 16:00:00', 0, 1),
(15, 133, 96, '2018-04-06 09:00:00', 0, 1),
(16, 124, 93, '2018-04-06 18:00:00', 0, 1),
(17, 122, 82, '2018-04-07 12:00:00', 0, 1),
(18, 130, 90, '2018-04-07 17:00:00', 0, 1),
(19, 118, 82, '2018-04-08 12:00:00', 0, 1),
(20, 122, 93, '2018-04-08 15:00:00', 0, 1),
(21, 132, 88, '2018-04-08 17:00:00', 0, 1),
(22, 118, 82, '2018-04-09 12:00:00', 0, 1),
(23, 120, 83, '2018-04-09 21:00:00', 0, 1),
(24, 128, 90, '2018-04-10 09:00:00', 0, 1),
(26, 113, 78, '2018-04-10 21:00:00', 0, 1),
(27, 130, 82, '2018-04-11 11:00:00', 0, 1),
(28, 132, 83, '2018-04-11 21:00:00', 0, 1),
(29, 118, 81, '2018-04-12 11:00:00', 0, 1),
(30, 114, 73, '2018-04-12 23:00:00', 0, 1),
(31, 120, 80, '2018-04-13 11:00:00', 0, 1),
(33, 123, 79, '2018-04-13 20:00:00', 0, 1),
(34, 118, 83, '2018-04-14 11:00:00', 0, 1),
(35, 123, 89, '2018-04-14 19:00:00', 0, 1);


--
-- Table structure for table `hr`
--

CREATE TABLE `hr` (
  `id` int(6) UNSIGNED NOT NULL,
  `value` smallint(6) NOT NULL,
  `time` datetime NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` int(6) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `hr`
--

INSERT INTO `hr` (`id`, `value`, `time`, `is_read`, `user_id`) VALUES
(1, 52, '2018-04-01 10:00:00', 0, 1),
(3, 66, '2018-04-01 15:00:00', 0, 1),
(5, 72, '2018-04-02 12:00:00', 0, 1),
(6, 52, '2018-04-02 18:00:00', 0, 1),
(7, 60, '2018-04-03 08:00:00', 0, 1),
(9, 80, '2018-04-03 16:00:00', 0, 1),
(11, 63, '2018-04-04 12:00:00', 0, 1),
(12, 55, '2018-04-04 20:00:00', 0, 1),
(13, 52, '2018-04-05 07:00:00', 0, 1),
(14, 71, '2018-04-05 16:00:00', 0, 1),
(15, 55, '2018-04-06 09:00:00', 0, 1),
(16, 77, '2018-04-06 18:00:00', 0, 1),
(17, 50, '2018-04-07 12:00:00', 0, 1),
(18, 60, '2018-04-07 17:00:00', 0, 1),
(19, 77, '2018-04-08 12:00:00', 0, 1),
(20, 70, '2018-04-08 15:00:00', 0, 1),
(21, 82, '2018-04-08 17:00:00', 0, 1),
(22, 65, '2018-04-09 12:00:00', 0, 1),
(23, 79, '2018-04-09 21:00:00', 0, 1),
(24, 66, '2018-04-10 09:00:00', 0, 1),
(26, 87, '2018-04-10 21:00:00', 0, 1),
(27, 66, '2018-04-11 11:00:00', 0, 1),
(28, 71, '2018-04-11 21:00:00', 0, 1),
(29, 55, '2018-04-12 11:00:00', 0, 1),
(30, 67, '2018-04-12 23:00:00', 0, 1),
(31, 55, '2018-04-13 11:00:00', 0, 1),
(33, 82, '2018-04-13 20:00:00', 0, 1),
(34, 49, '2018-04-14 11:00:00', 0, 1),
(35, 88, '2018-04-14 19:00:00', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `medication`
--

CREATE TABLE `medication` (
  `id` int(6) UNSIGNED NOT NULL,
  `name` varchar(128) NOT NULL,
  `time` datetime NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `user_id` int(6) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------
INSERT INTO `medication` (`id`, `name`, `time`, `is_read`, `user_id`) VALUES
(1, 'Dafalgan', '2018-04-01 10:00:00', 0, 1),
(3, 'Rhinathiol', '2018-04-01 15:00:00', 0, 1),
(5, 'Paracetamol', '2018-04-02 12:00:00', 0, 1),
(6, 'Rhinathiol', '2018-04-02 18:00:00', 0, 1),
(7, 'Paracetamol', '2018-04-03 08:00:00', 0, 1),
(9, 'Dafalgan', '2018-04-03 16:00:00', 0, 1),
(11, 'Paracetamol', '2018-04-04 12:00:00', 0, 1),
(12, 'Rhinathiol', '2018-04-04 20:00:00', 0, 1),
(13, 'Paracetamol', '2018-04-05 07:00:00', 0, 1),
(14, 'Dafalgan', '2018-04-05 16:00:00', 0, 1),
(15, 'Paracetamol', '2018-04-06 09:00:00', 0, 1),
(16, 'Rhinathiol', '2018-04-06 18:00:00', 0, 1),
(17, 'Rhinathiol', '2018-04-07 12:00:00', 0, 1),
(18, 'Dafalgan', '2018-04-07 17:00:00', 0, 1),
(19, 'Rhinathiol', '2018-04-08 12:00:00', 0, 1),
(20, 'Dafalgan', '2018-04-08 15:00:00', 0, 1),
(21, 'Paracetamol', '2018-04-08 17:00:00', 0, 1),
(22, 'Rhinathiol', '2018-04-09 12:00:00', 0, 1),
(23, 'Dafalgan', '2018-04-09 21:00:00', 0, 1),
(24, 'Dafalgan', '2018-04-10 09:00:00', 0, 1),
(26, 'Paracetamol', '2018-04-10 21:00:00', 0, 1),
(27, 'Rhinathiol', '2018-04-11 11:00:00', 0, 1),
(28, 'Dafalgan', '2018-04-11 21:00:00', 0, 1),
(29, 'Paracetamol', '2018-04-12 11:00:00', 0, 1),
(30, 'Dafalgan', '2018-04-12 23:00:00', 0, 1),
(31, 'Rhinathiol', '2018-04-13 11:00:00', 0, 1),
(33, 'Dafalgan', '2018-04-13 20:00:00', 0, 1),
(34, 'Dafalgan', '2018-04-14 11:00:00', 0, 1),
(35, 'Paracetamol', '2018-04-14 19:00:00', 0, 1);

--
-- Table structure for table `sleep`
--

CREATE TABLE `sleep` (
  `id` int(6) UNSIGNED NOT NULL,
  `duration` smallint(6) NOT NULL,
  `start` datetime NOT NULL,
  `time` datetime NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `user_id` int(6) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------
INSERT INTO `sleep` (`id`, `duration`, `start`, `time`, `is_read`, `user_id`) VALUES
(1, 360, '2018-04-01 01:00:00', '2018-04-01 10:00:00', 0, 1),
(5, 420, '2018-04-02 02:00:00', '2018-04-02 12:00:00', 0, 1),
(7, 450, '2018-04-03 02:20:00', '2018-04-03 08:00:00', 0, 1),
(12, 400, '2018-04-04 00:30:00', '2018-04-04 20:00:00', 0, 1),
(14, 320, '2018-04-05 02:00:00', '2018-04-05 16:00:00', 0, 1),
(15, 500, '2018-04-06 01:30:00', '2018-04-06 09:00:00', 0, 1),
(17, 520, '2018-04-07 00:20:00', '2018-04-07 12:00:00', 0, 1),
(19, 390, '2018-04-08 02:45:00', '2018-04-08 12:00:00', 0, 1),
(22, 620, '2018-04-09 03:00:00', '2018-04-09 12:00:00', 0, 1),
(24, 400, '2018-04-10 01:20:00', '2018-04-10 09:00:00', 0, 1),
(27, 380, '2018-04-11 00:50:00', '2018-04-11 11:00:00', 0, 1),
(29, 540, '2018-04-12 03:20:00', '2018-04-12 11:00:00', 0, 1),
(31, 320, '2018-04-13 02:00:00', '2018-04-13 11:00:00', 0, 1),
(34, 380, '2018-04-14 01:20:00', '2018-04-14 11:00:00', 0, 1);
--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(6) UNSIGNED NOT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `birth` date NOT NULL,
  `address` varchar(128) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `height` float NOT NULL,
  `blood_type` varchar(4) NOT NULL,
  `sex` varchar(2) NOT NULL,
  `last_activity` datetime NOT NULL,
  `last_visit` date NOT NULL,
  `next_visit` date NOT NULL,
  `priority` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `birth`, `address`, `phone`, `height`, `blood_type`, `sex`, `last_activity`, `last_visit`, `next_visit`, `priority`) VALUES
(1, 'Foo', 'Bar', '2018-04-04', 'adress 9, 3590 Diepenbeek', '089/223344', '1.84', 'O+', 'M', '2018-03-06 00:00:00', '2018-03-01', '2018-04-04', 2),
(2, 'Jane', 'Doe', '2017-07-03', 'Agoralaan 2, 3590 DPB', '089/111111', '1.64', 'A-', 'F', '2018-04-10 00:00:00', '2018-04-02', '2018-04-26', 0);

-- --------------------------------------------------------

--
-- Table structure for table `weight`
--

CREATE TABLE `weight` (
  `id` int(6) UNSIGNED NOT NULL,
  `value` smallint(6) NOT NULL,
  `time` datetime NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `user_id` int(6) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `weight` (`id`, `value`, `time`, `is_read`, `user_id`) VALUES
(1, 70, '2018-04-01 10:00:00', 0, 1),
(3, 72, '2018-04-01 15:00:00', 0, 1),
(5, 73, '2018-04-02 12:00:00', 0, 1),
(6, 73, '2018-04-02 18:00:00', 0, 1),
(7, 68, '2018-04-03 08:00:00', 0, 1),
(9, 68, '2018-04-03 16:00:00', 0, 1),
(11, 72, '2018-04-04 12:00:00', 0, 1),
(12, 67, '2018-04-04 20:00:00', 0, 1),
(13, 67, '2018-04-05 07:00:00', 0, 1),
(14, 66, '2018-04-05 16:00:00', 0, 1),
(15, 66, '2018-04-06 09:00:00', 0, 1),
(16, 66, '2018-04-06 18:00:00', 0, 1),
(17, 68, '2018-04-07 12:00:00', 0, 1),
(18, 69, '2018-04-07 17:00:00', 0, 1),
(19, 70, '2018-04-08 12:00:00', 0, 1),
(20, 68, '2018-04-08 15:00:00', 0, 1),
(21, 67, '2018-04-08 17:00:00', 0, 1),
(22, 65, '2018-04-09 12:00:00', 0, 1),
(23, 66, '2018-04-09 21:00:00', 0, 1),
(24, 67, '2018-04-10 09:00:00', 0, 1),
(26, 68, '2018-04-10 21:00:00', 0, 1),
(27, 66, '2018-04-11 11:00:00', 0, 1),
(28, 65, '2018-04-11 21:00:00', 0, 1),
(29, 65, '2018-04-12 11:00:00', 0, 1),
(30, 64, '2018-04-12 23:00:00', 0, 1),
(31, 65, '2018-04-13 11:00:00', 0, 1),
(33, 63, '2018-04-13 20:00:00', 0, 1),
(34, 66, '2018-04-14 11:00:00', 0, 1),
(35, 65, '2018-04-14 19:00:00', 0, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `blood_sugar`
--
ALTER TABLE `blood_sugar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `bp`
--
ALTER TABLE `bp`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `hr`
--
ALTER TABLE `hr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `medication`
--
ALTER TABLE `medication`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sleep`
--
ALTER TABLE `sleep`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `weight`
--
ALTER TABLE `weight`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity`
--
ALTER TABLE `activity`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blood_sugar`
--
ALTER TABLE `blood_sugar`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bp`
--
ALTER TABLE `bp`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hr`
--
ALTER TABLE `hr`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `medication`
--
ALTER TABLE `medication`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sleep`
--
ALTER TABLE `sleep`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `weight`
--
ALTER TABLE `weight`
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity`
--
ALTER TABLE `activity`
  ADD CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `blood_sugar`
--
ALTER TABLE `blood_sugar`
  ADD CONSTRAINT `blood_sugar_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `bp`
--
ALTER TABLE `bp`
  ADD CONSTRAINT `bp_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `hr`
--
ALTER TABLE `hr`
  ADD CONSTRAINT `hr_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `medication`
--
ALTER TABLE `medication`
  ADD CONSTRAINT `medication_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `sleep`
--
ALTER TABLE `sleep`
  ADD CONSTRAINT `sleep_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `weight`
--
ALTER TABLE `weight`
  ADD CONSTRAINT `weight_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
