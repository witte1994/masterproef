-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 12, 2018 at 01:01 AM
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

--
-- Table structure for table `hr`
--

CREATE TABLE `hr` (
  `id` int(6) UNSIGNED NOT NULL,
  `value` smallint(6) NOT NULL,
  `time` datetime NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `user_id` int(6) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `height` varchar(16) NOT NULL,
  `blood_type` varchar(4) NOT NULL,
  `sex` varchar(2) NOT NULL,
  `last_activity` datetime NOT NULL,
  `last_visit` date NOT NULL,
  `next_visit` date NOT NULL,
  `priority` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT;

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
