-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 26, 2025 at 06:57 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `billingbook`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `businesses`
--

CREATE TABLE `businesses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `gstin` varchar(255) DEFAULT NULL,
  `is_gst_registered` tinyint(1) NOT NULL DEFAULT 0,
  `enable_e_invoice` tinyint(1) NOT NULL DEFAULT 0,
  `pan` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `signature` varchar(255) DEFAULT NULL,
  `business_type` varchar(255) DEFAULT NULL,
  `industry_type` varchar(255) DEFAULT NULL,
  `invoice_prefix` varchar(255) NOT NULL DEFAULT 'INV',
  `quote_prefix` varchar(255) NOT NULL DEFAULT 'QUO',
  `currency` varchar(255) NOT NULL DEFAULT 'INR',
  `timezone` varchar(255) NOT NULL DEFAULT 'Asia/Kolkata',
  `date_format` varchar(255) NOT NULL DEFAULT 'd/m/Y',
  `decimal_separator` varchar(255) NOT NULL DEFAULT '.',
  `thousand_separator` varchar(255) NOT NULL DEFAULT ',',
  `decimal_places` int(11) NOT NULL DEFAULT 2,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `owner_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `businesses`
--

INSERT INTO `businesses` (`id`, `name`, `email`, `phone`, `address`, `city`, `state`, `country`, `zip_code`, `gstin`, `is_gst_registered`, `enable_e_invoice`, `pan`, `website`, `logo`, `signature`, `business_type`, `industry_type`, `invoice_prefix`, `quote_prefix`, `currency`, `timezone`, `date_format`, `decimal_separator`, `thousand_separator`, `decimal_places`, `is_active`, `owner_id`, `created_at`, `updated_at`) VALUES
(3, 'Brutecorp', 'maria.schmidt@example.com', '7832892132', 'buzzwisemark.online', 'Frankfurt', NULL, 'India', NULL, 'dsafsdafdsffddfsdfs', 0, 0, '55554545554455454', NULL, 'uploads/logos/k49PlYJa86JqYgVdi7ffji10mmXY0BCmUAH0L8n4.png', 'uploads/signatures/qKcfztrRgqLkxWZUuUSbgYuFxGsM4Xzr3G91oDp3.png', '\"Retailer,Wholesaler,Distributor,Manufacturer\"', 'Agriculture', 'INV', 'QUO', 'INR', 'Asia/Kolkata', 'd/m/Y', '.', ',', 2, 1, 8, '2025-11-07 01:13:25', '2025-11-10 01:34:07'),
(5, 'Brutecorp', 'naveen.webadsmedia@gmail.com', '7832892132', 'buzzwisemark.online', 'Frankfurt', NULL, 'India', NULL, 'dsafsdafdsffddfsdfs', 0, 0, '55554545554455454', NULL, 'uploads/logos/k49PlYJa86JqYgVdi7ffji10mmXY0BCmUAH0L8n4.png', 'uploads/signatures/qKcfztrRgqLkxWZUuUSbgYuFxGsM4Xzr3G91oDp3.png', '\"Retailer,Wholesaler,Distributor,Manufacturer\"', 'Agriculture', 'INV', 'QUO', 'INR', 'Asia/Kolkata', 'd/m/Y', '.', ',', 2, 1, 9, '2025-11-07 01:13:25', '2025-11-10 01:34:07');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `sort_order`, `is_active`, `business_id`, `created_at`, `updated_at`) VALUES
(2, 'Electronics', 'electronics', 'Electronic gadgets and devices like phones, TVs, and computers.', 'categories/electronics.jpg', 1, 1, 3, '2025-11-07 09:25:59', '2025-11-07 09:25:59'),
(3, 'Home Appliances', 'home-appliances', 'Appliances for home use such as washing machines, fridges, and ovens.', 'categories/home-appliances.jpg', 2, 1, 3, '2025-11-07 09:25:59', '2025-11-07 09:25:59'),
(4, 'Fashion', 'fashion', 'Clothing, footwear, and accessories for men and women.', 'categories/fashion.jpg', 3, 1, 3, '2025-11-07 09:25:59', '2025-11-07 09:25:59'),
(5, 'Groceries', 'groceries', 'Everyday essentials like food, beverages, and household items.', 'categories/groceries.jpg', 4, 1, 3, '2025-11-07 09:25:59', '2025-11-07 09:25:59'),
(6, 'Stationery', 'stationery', 'Office supplies and school stationery items.', 'categories/stationery.jpg', 5, 1, 3, '2025-11-07 09:25:59', '2025-11-07 09:25:59'),
(7, 'General', 'general', NULL, NULL, 0, 1, 3, '2025-11-07 10:27:46', '2025-11-07 10:27:46');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `alternate_phone` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `gstin` varchar(255) DEFAULT NULL,
  `pan` varchar(255) DEFAULT NULL,
  `billing_address` text DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `opening_balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `current_balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `credit_limit` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payment_terms` int(11) NOT NULL DEFAULT 0,
  `total_purchases` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_orders` int(11) NOT NULL DEFAULT 0,
  `last_order_date` date DEFAULT NULL,
  `customer_type` varchar(255) NOT NULL DEFAULT 'regular',
  `category` varchar(255) DEFAULT NULL,
  `balance_type` enum('To Collect','To Pay') NOT NULL DEFAULT 'To Collect',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `notes` text DEFAULT NULL,
  `custom_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_fields`)),
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customer_code`, `name`, `email`, `phone`, `alternate_phone`, `company_name`, `gstin`, `pan`, `billing_address`, `shipping_address`, `city`, `state`, `country`, `zip_code`, `opening_balance`, `current_balance`, `credit_limit`, `payment_terms`, `total_purchases`, `total_orders`, `last_order_date`, `customer_type`, `category`, `balance_type`, `is_active`, `notes`, `custom_fields`, `business_id`, `created_at`, `updated_at`) VALUES
(1, 'CUST-4JMNRX', 'Kendra D\'Amore', 'jennyfer.prosacco@example.com', '5175164012', '6352586520', 'Blick-Bayer', '41KOHO7883X1ZB', 'EGETR02441C', '474 Schimmel Drive Suite 412\nNorth Edythe, MS 36469', '8991 Jermain Summit Suite 105\nLake Maud, NH 33728', 'Arvidborough', 'Vermont', 'Macao', '52167-5242', 623.71, 1233.23, 1189.53, 41, 6956.34, 23, NULL, 'Supplier', 'Wholesale', 'To Collect', 0, 'Quae nisi dolores sapiente.', '\"{\\\"ref_code\\\":\\\"7ELVBSYF\\\",\\\"loyalty_points\\\":144}\"', 3, '2025-11-08 19:21:21', '2025-11-08 19:21:21'),
(2, 'CUST-PQN8FW', 'Jazmyne Wiza', 'cbartell@example.com', '3582889576', NULL, 'Tillman PLC', '15HWOM0099T1ZF', 'VEFSV25715B', '212 Jeffry Mall Suite 812\nNinachester, NY 72193-3587', '5147 Ondricka Path Apt. 129\nPort Milliefurt, AZ 81365-6217', 'Darrickton', 'Montana', 'Antigua and Barbuda', '67491-9381', 4111.47, 395.53, 5693.85, 56, 3929.18, 41, NULL, 'Customer', 'Retail', 'To Pay', 1, 'Debitis nesciunt harum tempore aut sed.', '\"{\\\"ref_code\\\":\\\"NJNOPCBE\\\",\\\"loyalty_points\\\":6}\"', 3, '2025-11-08 19:21:21', '2025-11-08 19:21:21'),
(3, 'CUST-DKJAJQ', 'Hailee Hayes', 'llubowitz@example.com', '8322643724', NULL, 'Abbott, Dickinson and Will', '09NDDI5824G1ZN', 'ERBNN89609J', '4404 Witting Brook Apt. 450\nSyblechester, GA 59286-7814', '8612 Alessandro Isle Suite 526\nStehrview, MT 25630', 'Abigailbury', 'Kentucky', 'Burundi', '30506', 4705.51, 4150.85, 4434.60, 42, 2747.78, 14, '2025-06-29', 'Customer', 'Retail', 'To Pay', 1, 'Aut harum voluptatem deserunt numquam.', '\"{\\\"ref_code\\\":\\\"XGE7E8BR\\\",\\\"loyalty_points\\\":168}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(4, 'CUST-XMLORK', 'Hunter Hickle', 'kip26@example.com', '2897869187', NULL, 'Corwin, O\'Hara and Hahn', '14KOHL4747W1ZP', 'TJLZP82078B', '732 Hamill Camp\nSouth Ally, MI 89103', '116 Glen Valley\nAshleyland, DE 40970-8710', 'West Anissaborough', 'Wyoming', 'Guinea-Bissau', '08742-3815', 1902.93, 1293.16, 1836.12, 10, 8221.69, 29, NULL, 'Supplier', 'Retail', 'To Collect', 1, 'Suscipit omnis deserunt dolores voluptatem sint.', '\"{\\\"ref_code\\\":\\\"QWY6QR2H\\\",\\\"loyalty_points\\\":102}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(5, 'CUST-NP9EDX', 'Lillie Cartwright I', 'lia.toy@example.net', '0607382770', '8880495966', 'Cruickshank Group', '42UEXL5072J1ZA', 'KVYRU89263S', '2688 Jakubowski Ways Suite 727\nLebsackborough, ID 25184-4316', '4942 Hill Shores\nTremouth, PA 93568', 'Rogahnside', 'Massachusetts', 'Ghana', '59370', 122.19, 911.34, 7059.15, 39, 774.50, 30, '2025-07-30', 'Customer', 'Retail', 'To Pay', 0, 'Quasi unde et magni aut dolores.', '\"{\\\"ref_code\\\":\\\"1QZE3SPH\\\",\\\"loyalty_points\\\":19}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(6, 'CUST-KPETCA', 'Nadia Prosacco DVM', 'marjolaine60@example.org', '2156732678', NULL, 'Crona, Rath and Botsford', '66PXMX0725G1ZD', 'YSBKS64912Q', '943 Alexandrea Highway Suite 022\nSouth Glenda, ID 82636-0083', '307 Hilario Mountains Suite 303\nAlexanneborough, NY 88449', 'Port Rosannaland', 'Massachusetts', 'Korea', '35764', 244.12, 307.68, 6181.31, 15, 6702.28, 46, '2025-09-18', 'Supplier', 'Wholesale', 'To Pay', 1, 'Reprehenderit magni voluptatem veniam magnam ex non debitis.', '\"{\\\"ref_code\\\":\\\"BIZUWYMV\\\",\\\"loyalty_points\\\":156}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(7, 'CUST-OLOLTM', 'London Cormier', 'sdietrich@example.com', '9655579399', '7229726513', 'Wisoky LLC', '87FXMH8355J1ZO', 'OZPVP53600Q', '90406 Hauck Mountains\nNew Levi, AL 48820', '2543 Cheyanne Plain\nVestachester, AZ 47383-5828', 'Quitzonland', 'Alaska', 'Croatia', '82691-0236', 4346.57, 169.79, 5492.21, 58, 3962.82, 7, NULL, 'Customer', 'Retail', 'To Pay', 1, 'Est non molestiae dignissimos numquam sunt quia.', '\"{\\\"ref_code\\\":\\\"MJRXQEG6\\\",\\\"loyalty_points\\\":139}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(8, 'CUST-DLHKQK', 'Katarina Hartmann', 'camila89@example.net', '0808181533', NULL, 'Konopelski Ltd', '01HPSJ2031T1ZY', 'CLJQL06644P', '756 Abbott Forest Apt. 293\nJoanneberg, CO 05965-2082', '462 Bode Circle\nNorth Deondre, OK 27045', 'East Andy', 'New Jersey', 'Panama', '37928', 2785.87, 1066.41, 2980.01, 16, 5770.25, 3, NULL, 'Customer', 'Retail', 'To Pay', 1, 'Voluptatem asperiores vel ipsam libero eos.', '\"{\\\"ref_code\\\":\\\"1UQPFUZV\\\",\\\"loyalty_points\\\":179}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(9, 'CUST-GVT2MX', 'Joanne Hickle II', 'marjorie.feest@example.org', '4556010615', NULL, 'Klein Ltd', '27WFRY0364G1ZQ', 'XCUIC07358N', '76126 Griffin Garden Suite 610\nJakeland, NY 17416', '4445 Effertz Parks\nLake Pasqualemouth, MS 07252-0386', 'North Christ', 'Illinois', 'Isle of Man', '59166', 1506.35, 1994.31, 2904.68, 28, 864.82, 0, '2025-07-13', 'Customer', 'Retail', 'To Pay', 1, 'Delectus maiores perferendis est quia dolorem eaque.', '\"{\\\"ref_code\\\":\\\"YDFJXHS2\\\",\\\"loyalty_points\\\":2}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(10, 'CUST-YG9RYY', 'Hal Gleason I', 'shartmann@example.net', '5314168391', NULL, 'Quitzon, White and Nader', '25AWRW6698I1ZK', 'YUGUB09371K', '55030 Wolff Mountain\nNew Ciara, TX 31422', '788 Kihn Unions Suite 334\nNew Rose, SD 12583', 'Hartmannmouth', 'Nevada', 'Montserrat', '13431', 4635.36, 4692.67, 1755.35, 18, 8263.51, 13, '2025-10-20', 'Customer', 'Wholesale', 'To Pay', 1, 'Iure necessitatibus architecto dolores voluptatem sit.', '\"{\\\"ref_code\\\":\\\"3JAIUBV1\\\",\\\"loyalty_points\\\":53}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(11, 'CUST-ZYXSGK', 'Raina Kunde DDS', 'wilton80@example.org', '8930736436', NULL, 'Mayer, Walsh and Ullrich', '89NVUF6736O1ZI', 'VBKGR76986L', '9580 Connelly Track Suite 126\nNew Laurenceburgh, OK 40399', '70597 Eulalia Cape\nNew Woodrow, MT 16572-0071', 'Carminefort', 'South Carolina', 'Mayotte', '64658-1308', 4782.21, 866.68, 5095.53, 46, 3882.76, 43, '2025-06-09', 'Supplier', 'Retail', 'To Collect', 1, 'Illum ut sit perferendis et est at animi.', '\"{\\\"ref_code\\\":\\\"RAQBQNUN\\\",\\\"loyalty_points\\\":53}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(12, 'CUST-X310V9', 'Clinton Gerlach', 'megane89@example.org', '8420318972', NULL, 'Morar-Conroy', '55YKCE6977B1ZC', 'LOTBJ46348U', '75199 Seamus Knoll\nNorth Hazelstad, NC 74298-0132', '32314 Alysha Ridge\nLake Hannaside, MN 64366-2343', 'East Zane', 'Alaska', 'Cocos (Keeling) Islands', '71246-4489', 2696.35, 909.77, 4379.63, 32, 1341.39, 10, NULL, 'Customer', 'Wholesale', 'To Pay', 1, 'Autem voluptas mollitia in dicta sint voluptatem.', '\"{\\\"ref_code\\\":\\\"JHFKCJGN\\\",\\\"loyalty_points\\\":95}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(13, 'CUST-UOJEEF', 'Mark Murazik', 'pearl96@example.org', '7468009834', NULL, 'Jacobs-Barton', '58YXBA4976F1ZC', 'IOGMO93475T', '1802 Kohler Causeway Suite 264\nHarmonbury, DC 35562-5832', '97810 Dorothy Plains Suite 804\nOberbrunnermouth, TX 52600', 'West Olga', 'Maine', 'Tuvalu', '49908', 354.79, 953.29, 3025.37, 29, 3387.18, 6, '2025-09-10', 'Supplier', 'Wholesale', 'To Pay', 1, 'Natus est at aut autem.', '\"{\\\"ref_code\\\":\\\"SHBIIJF5\\\",\\\"loyalty_points\\\":173}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(14, 'CUST-2P1SPI', 'Micheal Smitham', 'zzulauf@example.com', '4191598263', NULL, 'Crist-Nader', '49QHLW9707E1ZL', 'SEBDS10880H', '187 Cassin Course\nSouth Boport, NC 95200-4881', '7869 Weimann Village Apt. 967\nAbernathytown, LA 20843', 'New Deanna', 'South Dakota', 'Guadeloupe', '87481-3255', 4201.75, 700.80, 6513.44, 29, 1301.75, 44, '2025-05-13', 'Customer', 'Retail', 'To Collect', 0, 'Eum eveniet laboriosam sit recusandae et dolores cupiditate eligendi.', '\"{\\\"ref_code\\\":\\\"7CKOJRQZ\\\",\\\"loyalty_points\\\":60}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(15, 'CUST-FXTDJW', 'Amber Auer', 'tabshire@example.com', '8887308743', '0903629161', 'Bahringer Inc', '74ZWRN4834W1ZI', 'GMZME59659P', '37866 Bednar Tunnel Suite 038\nVanceview, PA 11988', '9044 Grant Port Apt. 994\nAmaliachester, CO 09857-4502', 'South Luna', 'North Dakota', 'Greenland', '93973-4234', 3371.07, 877.37, 3081.80, 55, 3799.31, 44, NULL, 'Customer', 'Wholesale', 'To Collect', 0, 'Saepe voluptate est culpa est eveniet quis illo.', '\"{\\\"ref_code\\\":\\\"5MVAIJH5\\\",\\\"loyalty_points\\\":96}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(16, 'CUST-IBB0LS', 'Mr. Thaddeus Becker DVM', 'ellie.aufderhar@example.net', '2081467636', '9079651415', 'Maggio-O\'Keefe', '45DGUU0798M1ZF', 'UIYBQ96730S', '161 Osinski Lights Suite 465\nBoehmmouth, PA 36235-5621', '555 Cole Drive Apt. 086\nEast Newton, MI 41312-4326', 'Kochberg', 'Maine', 'Nigeria', '74024-3327', 1633.55, 1690.60, 7695.64, 40, 9973.93, 4, NULL, 'Supplier', 'Wholesale', 'To Collect', 1, 'Porro necessitatibus iure in error et aut enim.', '\"{\\\"ref_code\\\":\\\"SKQZIHKL\\\",\\\"loyalty_points\\\":11}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(17, 'CUST-GKURD5', 'Mrs. Carolyne Kuphal', 'pwolff@example.net', '9387848126', '6581300290', 'Powlowski Ltd', '75VDSX3810E1ZO', 'GKBAX46836K', '8485 Marques Plaza Apt. 379\nBatzborough, AR 79247', '2970 Pfannerstill Squares Apt. 962\nEllenland, WI 15673', 'North Giles', 'West Virginia', 'Oman', '71106', 1912.30, 997.42, 6492.31, 2, 2950.19, 41, NULL, 'Supplier', 'Wholesale', 'To Pay', 1, 'Praesentium sunt error dolorum culpa eum et.', '\"{\\\"ref_code\\\":\\\"UMO3Q2YW\\\",\\\"loyalty_points\\\":150}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(18, 'CUST-FCRZ1W', 'Mr. Kristofer Satterfield Jr.', 'celia.oreilly@example.com', '6579551085', '4013217645', 'Terry, Hoppe and Pagac', '07ZRHA6833R1ZE', 'FGPXH60380R', '83914 Nicolas Crescent Apt. 044\nLake Clarabelle, NJ 20113-6364', '8315 Schiller Mountains Suite 406\nDietrichside, CA 78248-5037', 'Lake Yazminville', 'South Carolina', 'French Polynesia', '03970', 821.56, 4409.25, 6046.66, 26, 6121.79, 9, NULL, 'Supplier', 'Wholesale', 'To Collect', 1, 'Maxime quo odio et nostrum.', '\"{\\\"ref_code\\\":\\\"0E1STKCD\\\",\\\"loyalty_points\\\":99}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(19, 'CUST-FPATR7', 'Eliseo Botsford', 'mabelle69@example.com', '3759175253', '1433456484', 'Kautzer, Barton and Wilkinson', '09FDVL6812T1ZI', 'QUMAQ01994W', '96492 Aaron Avenue Suite 814\nPort Hollieview, SC 62347-7815', '73043 Kris Tunnel\nCiceroberg, MT 60703', 'Breitenbergberg', 'Vermont', 'Mali', '84632-8949', 628.78, 4212.84, 2273.64, 60, 9414.36, 47, '2025-08-20', 'Customer', 'Wholesale', 'To Collect', 1, 'Esse sit vel voluptatibus asperiores voluptatem et.', '\"{\\\"ref_code\\\":\\\"GRC4RH2G\\\",\\\"loyalty_points\\\":111}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(20, 'CUST-YRPPPX', 'Niko Klocko', 'lolita.glover@example.com', '1922793465', '1069504928', 'Nicolas-Ruecker', '43KELU2217D1ZN', 'OYIUI60980I', '9533 Jammie Track\nLeramouth, DE 13791', '5497 Neoma Ville\nPort Monroeberg, WA 41774', 'Jacintheville', 'Pennsylvania', 'China', '82652-5336', 3042.14, 1610.38, 2562.19, 3, 8115.07, 16, '2025-08-22', 'Customer', 'Retail', 'To Pay', 0, 'Minima non omnis consequuntur sint vel earum fugit.', '\"{\\\"ref_code\\\":\\\"PDBDTEM5\\\",\\\"loyalty_points\\\":14}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(21, 'CUST-WPBPRG', 'Breana Bogan', 'haag.tessie@example.org', '9389256487', '4847805848', 'Bernhard, Dickens and Marquardt', '99QCLG8572R1ZT', 'KIFYY04107U', '7070 Era Underpass\nRutherfordfort, LA 22581-9385', '14196 Elda Center\nCathrinefort, ND 49914', 'Makaylaport', 'Utah', 'Norway', '09936', 3065.49, 4885.37, 2669.38, 52, 538.81, 45, '2025-10-15', 'Supplier', 'Wholesale', 'To Pay', 1, 'In culpa in minus eligendi officia aut totam.', '\"{\\\"ref_code\\\":\\\"U8OWR6UC\\\",\\\"loyalty_points\\\":168}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(22, 'CUST-ZTGVNE', 'Allison Auer', 'tina51@example.com', '5753769545', NULL, 'Paucek, Nader and Tromp', '95ZZJA6549J1ZG', 'VDCXA54692N', '9933 Alexandra Valley Suite 103\nNorth Noemichester, CA 20281-1851', '1217 Blick Track Suite 497\nUptonview, HI 51594-4900', 'Jastchester', 'Wyoming', 'Kuwait', '29790', 4658.90, 2923.76, 1567.55, 28, 2696.51, 7, '2025-08-03', 'Supplier', 'Retail', 'To Pay', 0, 'Esse voluptatibus nostrum nisi qui et numquam.', '\"{\\\"ref_code\\\":\\\"IVUCGM2W\\\",\\\"loyalty_points\\\":131}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(23, 'CUST-VKFIAG', 'Rowena Beahan', 'batz.scottie@example.net', '5237714801', '7832406018', 'Gislason Inc', '77XLJD6716F1ZF', 'KGCPH22237P', '630 Keshawn Dam\nGarnettborough, NC 52562-9159', '45602 Ward Freeway Apt. 556\nLaurettaberg, NE 39117-1727', 'Normaberg', 'Colorado', 'Azerbaijan', '08331', 4974.71, 1459.01, 6572.63, 26, 702.56, 4, NULL, 'Customer', 'Retail', 'To Pay', 1, 'Omnis dolorum fugiat ea autem quam illo eius aut.', '\"{\\\"ref_code\\\":\\\"2K3DBSNX\\\",\\\"loyalty_points\\\":58}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(24, 'CUST-VZ71WP', 'Dr. Arlo Batz', 'pzieme@example.org', '0023770624', NULL, 'Wilkinson and Sons', '37KAAH4333P1ZI', 'RIGBY71922G', '3128 Runolfsdottir Summit\nJordynfurt, MT 37672', '907 Pagac Loop\nCarolineville, CA 55420', 'South Nicolettechester', 'California', 'El Salvador', '81905-6294', 221.77, 3629.16, 3466.46, 59, 2607.68, 14, NULL, 'Supplier', 'Wholesale', 'To Collect', 1, 'Ipsum molestiae et enim dolorem veritatis ullam totam.', '\"{\\\"ref_code\\\":\\\"VXR6WDEE\\\",\\\"loyalty_points\\\":200}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(25, 'CUST-XCMOO3', 'Micheal Ernser', 'lehner.raina@example.net', '0099363500', '1501890461', 'Abshire, Funk and Herman', '01JLYI0429K1ZD', 'TRPNW34975W', '6383 Casper Cliffs Apt. 255\nLake Flo, NC 25052', '430 Bahringer Ports\nTrompfort, HI 34279-6588', 'Desireeburgh', 'Oregon', 'Georgia', '97214', 1567.36, 480.18, 9637.42, 12, 7600.29, 27, NULL, 'Supplier', 'Retail', 'To Pay', 1, 'Veniam quo modi in quam et illo culpa.', '\"{\\\"ref_code\\\":\\\"UVGCALIS\\\",\\\"loyalty_points\\\":59}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(26, 'CUST-5STYEJ', 'Lenna Veum', 'ngrimes@example.net', '7365533168', NULL, 'Kessler Group', '07OZVI0102K1ZT', 'KJYJX28400U', '9965 Doyle Flats Apt. 187\nPort Hardy, DC 16073-8953', '7044 Sauer Plaza Apt. 321\nSouth Ahmadside, MI 72068-2810', 'East Missourimouth', 'Virginia', 'Cote d\'Ivoire', '21822', 4283.59, 2907.65, 4801.99, 9, 215.94, 41, NULL, 'Customer', 'Wholesale', 'To Pay', 0, 'Est porro aliquam autem est fugit.', '\"{\\\"ref_code\\\":\\\"R5FOZRDL\\\",\\\"loyalty_points\\\":64}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(27, 'CUST-OJIXK3', 'Mariano Heaney', 'devonte05@example.net', '5991676889', NULL, 'Koelpin, Bode and King', '43XJDW0488B1ZC', 'TYXCE59316M', '5329 Moore Mountains Apt. 908\nEast Harveychester, KS 79894', '35117 Karina Rue\nCorkeryhaven, WA 17229-5890', 'Port Madilyn', 'Utah', 'Turkey', '98317-7152', 1242.08, 4577.62, 7269.93, 60, 8203.74, 34, NULL, 'Customer', 'Wholesale', 'To Collect', 1, 'Velit quos eveniet eveniet suscipit repellendus.', '\"{\\\"ref_code\\\":\\\"HBD1VGD1\\\",\\\"loyalty_points\\\":128}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(28, 'CUST-VGJATA', 'Johnathon Cummings', 'vbernier@example.net', '2030902290', '7854633516', 'Koch Group', '14YMXE7909W1ZQ', 'LWDWL37150C', '40404 Heidi Brooks\nRaynorbury, LA 32581', '7842 Dave Garden Apt. 435\nJudahfurt, IA 40280', 'Yasmeenport', 'Tennessee', 'Myanmar', '81025-6363', 3124.11, 2771.75, 7961.38, 1, 1176.20, 8, NULL, 'Customer', 'Wholesale', 'To Collect', 1, 'Illo illum voluptatem eligendi quos saepe.', '\"{\\\"ref_code\\\":\\\"7LVEIUHX\\\",\\\"loyalty_points\\\":50}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(29, 'CUST-QXJCW5', 'Mrs. Janelle Huel MD', 'gabrielle76@example.com', '5230247599', '7770249275', 'Hamill, Cruickshank and Donnelly', '42ZMCD3436W1ZX', 'RKIEO34020Q', '6377 Tillman Spring Apt. 656\nLake Lizethchester, CT 56678-4017', '99186 Schulist Overpass Suite 583\nNew Morgan, NH 52104', 'Bryonfort', 'Pennsylvania', 'Puerto Rico', '81709', 928.71, 4680.38, 8827.43, 35, 2757.50, 31, '2025-07-18', 'Supplier', 'Wholesale', 'To Collect', 1, 'Fugit blanditiis commodi perspiciatis autem veritatis praesentium.', '\"{\\\"ref_code\\\":\\\"I4YSQL5E\\\",\\\"loyalty_points\\\":52}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(30, 'CUST-SWOLRV', 'Brenda Emmerich Jr.', 'gwolff@example.org', '8860760100', NULL, 'Kemmer, Trantow and Torp', '52HEOX2828R1ZB', 'ZXVHP94725Y', '349 Adella Plain Apt. 771\nDachborough, AL 12404-1276', '669 Cartwright Forks\nSouth Tyrese, AZ 00936', 'New Roderick', 'West Virginia', 'Venezuela', '53000-6409', 1282.82, 874.28, 1152.65, 40, 804.77, 15, '2025-10-06', 'Customer', 'Retail', 'To Collect', 1, 'Veniam a eligendi dolore velit pariatur dolor.', '\"{\\\"ref_code\\\":\\\"7VRRPS5U\\\",\\\"loyalty_points\\\":145}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(31, 'CUST-ZLNTEJ', 'Dallin Roberts', 'jacobson.wanda@example.com', '5982010398', '7050172739', 'Waters, Dicki and Purdy', '34JLDT3043B1ZI', 'XOJFI12977Z', '348 Verona Mission\nEast Oraburgh, VA 80099-2460', '484 Mueller Union Apt. 422\nSantinaport, CO 28614-3750', 'New Odessa', 'Indiana', 'Norfolk Island', '33462-0876', 1616.26, 1025.60, 880.79, 42, 5246.06, 45, NULL, 'Supplier', 'Wholesale', 'To Pay', 1, 'Enim est est adipisci aut fugit dolorum cumque.', '\"{\\\"ref_code\\\":\\\"JKCBN2AH\\\",\\\"loyalty_points\\\":47}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(32, 'CUST-BN71IK', 'Sonia Ryan', 'sanford.mafalda@example.net', '3108167391', NULL, 'Crona PLC', '16CZCU7674R1ZD', 'IJOAG67403N', '106 Shemar Knolls\nEast Alison, WY 27175-8020', '485 Block Landing\nPredovicton, WI 70863', 'Bridieside', 'Hawaii', 'Guinea', '52691', 236.91, 2328.36, 3477.82, 54, 1933.47, 46, NULL, 'Supplier', 'Retail', 'To Pay', 1, 'Dolor blanditiis qui quia corrupti voluptatem atque minus.', '\"{\\\"ref_code\\\":\\\"XLKWQUI1\\\",\\\"loyalty_points\\\":153}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(33, 'CUST-SQRFZR', 'Florine Gaylord I', 'liliana.lubowitz@example.org', '6046470704', NULL, 'Roob-Harber', '55AWDP9314H1ZO', 'ULJFH29135L', '9697 Walker Course Apt. 308\nNew Germaineport, NV 26940', '8852 Johnston Estates\nNew Clemmieborough, NC 67936', 'Jonathonhaven', 'South Dakota', 'Honduras', '82395', 787.73, 1482.93, 5395.14, 10, 7948.02, 17, NULL, 'Supplier', 'Retail', 'To Pay', 1, 'Dignissimos ea nesciunt nostrum eligendi.', '\"{\\\"ref_code\\\":\\\"QAWIVD4Y\\\",\\\"loyalty_points\\\":177}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(34, 'CUST-AA3GOA', 'Saul Schuster', 'pstamm@example.com', '2925881431', '1076162692', 'Jenkins Ltd', '24EQRU2779I1ZS', 'AEIZY37136Q', '43223 Boyer Brook\nPort Rachel, IA 72291-2678', '50042 Thaddeus Bypass\nNew Sadyestad, KY 41937-7931', 'East Octavia', 'Georgia', 'New Zealand', '64360', 4255.87, 2256.70, 9435.09, 45, 3449.67, 32, '2025-10-27', 'Customer', 'Wholesale', 'To Pay', 0, 'Nihil odit magni voluptas voluptate quam voluptatem.', '\"{\\\"ref_code\\\":\\\"TFXPRSYT\\\",\\\"loyalty_points\\\":134}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(35, 'CUST-I0WBTK', 'Felicia Macejkovic', 'bhowell@example.com', '7315858840', '1998391424', 'White PLC', '09RXSE4986X1ZN', 'XQKCF30230L', '39320 Jenifer Plaza Suite 934\nEast Lila, TX 64636-4550', '9331 Devante Port Suite 385\nCalimouth, ND 27076', 'New Kristina', 'Hawaii', 'Solomon Islands', '64714-8275', 1886.08, 1554.68, 5726.81, 30, 900.32, 49, '2025-06-05', 'Supplier', 'Retail', 'To Collect', 1, 'Quos ex hic ea et fugiat ut.', '\"{\\\"ref_code\\\":\\\"SWRFERZW\\\",\\\"loyalty_points\\\":12}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(36, 'CUST-DZQF6W', 'Garnet Green', 'jammie42@example.net', '4820134249', '8844851603', 'Schinner, Weimann and Hudson', '97EGTS0072N1ZM', 'PFCSH62378B', '7291 Nick Manor\nEast Zachariah, MD 01451', '668 Olen Well\nQuigleyshire, DE 59909', 'Zulaufborough', 'Michigan', 'Armenia', '57298', 332.71, 2068.69, 5981.46, 10, 8215.26, 26, NULL, 'Supplier', 'Wholesale', 'To Pay', 1, 'Exercitationem fugit dolorum deleniti qui perferendis eum veritatis.', '\"{\\\"ref_code\\\":\\\"0GRS47SM\\\",\\\"loyalty_points\\\":76}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(37, 'CUST-U4ECJG', 'Mrs. Rosanna Pfeffer', 'owen.lynch@example.net', '8259508310', '8691659631', 'Bartell PLC', '99VHPW2246L1ZJ', 'MTSQS64488P', '551 Kirlin Port\nBrooklynport, RI 52564', '424 Kamron Oval\nNew Mikemouth, NC 34747-1459', 'Baumbachland', 'Montana', 'Iraq', '36566-6393', 3563.62, 4336.18, 512.51, 32, 7168.09, 44, NULL, 'Supplier', 'Wholesale', 'To Pay', 1, 'Odit odit officiis laudantium aspernatur vitae.', '\"{\\\"ref_code\\\":\\\"DYIM2VD6\\\",\\\"loyalty_points\\\":24}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(38, 'CUST-KEHLIS', 'Johanna Sawayn', 'francesca98@example.org', '0651215763', '5059456726', 'Kohler, Durgan and Gaylord', '73JBUH9629K1ZO', 'GNHYS98203J', '35248 Juliet Underpass\nLake Staceyland, UT 67989', '9330 Dare Way Apt. 086\nEast Gayleshire, NV 08835', 'West Brisaport', 'Alabama', 'Ukraine', '13286', 464.83, 601.66, 1391.61, 40, 3250.30, 6, NULL, 'Supplier', 'Retail', 'To Collect', 1, 'Ut voluptas quibusdam praesentium est.', '\"{\\\"ref_code\\\":\\\"QKIXOU1W\\\",\\\"loyalty_points\\\":81}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(39, 'CUST-AG8SRJ', 'Liana Metz', 'xleffler@example.org', '6611394670', '5140476918', 'Huels, Fay and Abshire', '79DTIB4484O1ZF', 'KYHVM33475Y', '760 Robel Rapids Suite 772\nSouth Mathiasview, MA 26478-9003', '45702 Cara Mission Suite 261\nNorth Stephanyborough, RI 54268-7612', 'Littelville', 'Illinois', 'Slovenia', '61022', 2981.44, 108.75, 7269.73, 31, 6343.54, 41, '2025-05-24', 'Supplier', 'Wholesale', 'To Collect', 0, 'Eligendi consectetur ad atque magni sit cupiditate consequuntur odio.', '\"{\\\"ref_code\\\":\\\"WEJSLOSH\\\",\\\"loyalty_points\\\":136}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(40, 'CUST-URESMN', 'Germaine Willms Jr.', 'destany.becker@example.net', '2848757562', '4188183986', 'D\'Amore, Bednar and Quitzon', '51RGLC7101I1ZI', 'VLMNZ14589X', '7262 Kaden Tunnel\nWest Selena, OR 50189-0433', '627 Gerhold Hollow\nJudgetown, KY 50445-1757', 'Kiehnside', 'Alabama', 'Tajikistan', '05484-2208', 3895.27, 1280.85, 1205.35, 0, 4824.63, 4, NULL, 'Customer', 'Retail', 'To Pay', 1, 'Similique ut eos et laudantium mollitia.', '\"{\\\"ref_code\\\":\\\"UUOUH7EZ\\\",\\\"loyalty_points\\\":99}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(41, 'CUST-DWHCZU', 'Anjali Cruickshank', 'amayert@example.com', '0424317293', NULL, 'Hintz, Bartell and Romaguera', '74EMLU7602S1ZA', 'IRTOU43087J', '9137 Gillian Loop\nTowneville, ND 55189', '181 Bechtelar Tunnel\nPurdybury, NM 92267', 'Bentonland', 'Massachusetts', 'Trinidad and Tobago', '64621-1038', 4465.69, 874.54, 8410.29, 10, 2476.56, 36, '2025-08-24', 'Customer', 'Retail', 'To Collect', 1, 'Rerum nisi est tempore non.', '\"{\\\"ref_code\\\":\\\"QZZC2CD9\\\",\\\"loyalty_points\\\":11}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(42, 'CUST-UWJJ1Y', 'Kenny Gerlach', 'grant.joana@example.com', '9239404727', '6668226314', 'Miller Ltd', '00TSCX8533O1ZD', 'IJHDW10196K', '970 Hulda Summit Suite 983\nLeslieborough, MD 91998', '228 Maurice Knolls Suite 882\nAnabelfort, NY 42933', 'Zoeyberg', 'Connecticut', 'Northern Mariana Islands', '18034', 3061.22, 2758.25, 3111.39, 46, 5881.04, 0, NULL, 'Supplier', 'Retail', 'To Collect', 1, 'Voluptas blanditiis corrupti sit tempore vero facilis dolores.', '\"{\\\"ref_code\\\":\\\"YCOCUOFO\\\",\\\"loyalty_points\\\":93}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(43, 'CUST-MXGIT1', 'Mrs. Georgette Purdy DDS', 'xkling@example.net', '7941407145', '5315015681', 'Becker, Leannon and Reinger', '47JZFI7181K1ZG', 'SXFDV22396B', '1361 Blick Flat Suite 361\nWest Oswaldo, UT 20217', '3942 Chanelle Lights Suite 067\nPort Ladarius, AR 22918', 'Madisenbury', 'South Carolina', 'Bahamas', '62269-8728', 121.67, 3571.21, 6828.59, 42, 8326.97, 11, NULL, 'Supplier', 'Retail', 'To Collect', 1, 'Doloremque vel sequi nihil qui eligendi sequi exercitationem deserunt.', '\"{\\\"ref_code\\\":\\\"N7PSDWVP\\\",\\\"loyalty_points\\\":74}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(44, 'CUST-GF2CZW', 'Valentina Franecki', 'cecile44@example.org', '9553820920', '8292599455', 'Mraz-Grant', '95GCJR3218S1ZF', 'EGYPG56700W', '564 Mya Plaza\nWest Amani, DC 22610', '1385 Maya Point Suite 420\nNolanland, LA 97689', 'East Jedchester', 'Ohio', 'Heard Island and McDonald Islands', '23091-1924', 3542.60, 3052.47, 6753.03, 31, 6312.11, 3, '2025-08-12', 'Supplier', 'Retail', 'To Pay', 0, 'Ut nisi molestiae et nihil.', '\"{\\\"ref_code\\\":\\\"YSP6QBSS\\\",\\\"loyalty_points\\\":102}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(45, 'CUST-VXVZPE', 'Ms. Ebony Kemmer', 'paxton.heaney@example.org', '3082121776', '7325808709', 'Schinner, Crist and Walter', '03XAXJ5251J1ZI', 'MCRWN31968G', '224 Lorenz Extensions\nJacobsland, ME 44024', '9867 Grady Forks\nMerlinborough, MD 37272', 'Lonnybury', 'New Mexico', 'Kyrgyz Republic', '69229-9079', 855.47, 491.68, 90.50, 6, 7832.36, 6, NULL, 'Customer', 'Retail', 'To Pay', 1, 'Eos facilis eum excepturi consectetur blanditiis.', '\"{\\\"ref_code\\\":\\\"5F06POQO\\\",\\\"loyalty_points\\\":177}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(46, 'CUST-BMQBGC', 'Heaven Zemlak Sr.', 'dangelo.lebsack@example.net', '1374502016', NULL, 'Beer, Heaney and Wehner', '06NQUE3944U1ZG', 'TQXGB77430I', '7827 Willms Ways Apt. 826\nClaudinechester, VT 84972', '447 Muriel Passage\nMcClurehaven, WY 48891-1805', 'Veumville', 'Massachusetts', 'Chile', '27966-2601', 2367.56, 2259.09, 3354.07, 30, 9654.33, 48, NULL, 'Customer', 'Retail', 'To Pay', 1, 'Ea ut amet eos sed commodi excepturi ratione.', '\"{\\\"ref_code\\\":\\\"PHXFJSHZ\\\",\\\"loyalty_points\\\":46}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(47, 'CUST-YQY0LF', 'Paul Jacobson', 'hkuhn@example.com', '6698670330', '6063224591', 'Lesch LLC', '21ZXCQ6665X1ZO', 'TNPZV45984F', '2222 Carmen Cliffs Apt. 683\nWest Nils, SC 44847-1383', '2936 Elvera Stream\nNew Haleigh, WA 46428-3957', 'Kingtown', 'Kansas', 'United States of America', '82463-3648', 1875.06, 927.89, 835.35, 1, 4054.29, 7, NULL, 'Supplier', 'Retail', 'To Pay', 1, 'Eius nam dignissimos ipsa fugit perferendis rerum quo.', '\"{\\\"ref_code\\\":\\\"I5M0DWMV\\\",\\\"loyalty_points\\\":139}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(48, 'CUST-AJUEVU', 'Alejandra Welch', 'devin97@example.org', '9517875059', NULL, 'Hodkiewicz-Lakin', '61SLQQ3139H1ZY', 'YZVUS42823K', '316 Walter Path\nNorth Pattown, OH 95131', '58507 Gussie Mount\nSouth Rubie, MO 93253', 'South Lonny', 'Kentucky', 'New Zealand', '81750', 2609.47, 1904.24, 440.27, 27, 9036.64, 41, '2025-08-26', 'Supplier', 'Retail', 'To Pay', 1, 'Dolor quis temporibus quaerat aut.', '\"{\\\"ref_code\\\":\\\"GIMHA2KA\\\",\\\"loyalty_points\\\":5}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(49, 'CUST-KUQMVJ', 'Keely Nolan MD', 'damore.maye@example.org', '4955426309', NULL, 'Watsica-Kihn', '24HSRG0755W1ZU', 'UWHQN38781A', '899 Ullrich Canyon\nConorburgh, KS 08739', '66506 Berneice Shoals\nKiehnberg, GA 22753', 'Port Lavernaburgh', 'Arizona', 'Russian Federation', '03691', 3621.04, 2560.67, 1946.32, 59, 8160.30, 43, NULL, 'Customer', 'Wholesale', 'To Collect', 0, 'Occaecati ut in autem perspiciatis rem molestiae quas.', '\"{\\\"ref_code\\\":\\\"RUDRO43D\\\",\\\"loyalty_points\\\":69}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(50, 'CUST-OFHI0W', 'Ms. Gwen Mayert', 'vhettinger@example.com', '0510609870', '9058088306', 'Mayert-Prohaska', '64EZZE4335W1ZH', 'HDWBH27985F', '80211 Wilkinson Creek Apt. 032\nHarberfort, AL 30467', '2430 Vern Drive\nFaystad, OK 06204-5910', 'East Juanita', 'Utah', 'Antarctica (the territory South of 60 deg S)', '31127', 2532.76, 1910.23, 2396.45, 21, 8266.14, 22, '2025-10-31', 'Supplier', 'Retail', 'To Collect', 1, 'Occaecati ut vel omnis autem et earum.', '\"{\\\"ref_code\\\":\\\"14P4SZLR\\\",\\\"loyalty_points\\\":180}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(51, 'CUST-0HKOWZ', 'Adelbert Hammes V', 'erik37@example.net', '1247675524', '1998749064', 'Hessel, Kub and Brekke', '42MESG3023J1ZR', 'UVLSP82826E', '958 Pietro Trail\nFredymouth, NE 44724', '1214 Upton Village Suite 107\nWest Brendenborough, IL 46695-1718', 'Michelmouth', 'Utah', 'Puerto Rico', '63562', 1187.42, 2601.01, 6874.85, 50, 7027.35, 29, NULL, 'Customer', 'Wholesale', 'To Pay', 1, 'Maxime quis sed est dolores.', '\"{\\\"ref_code\\\":\\\"LU6QLXJZ\\\",\\\"loyalty_points\\\":60}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(52, 'CUST-9HLAAS', 'Floyd Krajcik', 'cristian93@example.net', '3602242670', '4065988090', 'Bahringer-Christiansen', '23XJKX6006T1ZM', 'LLDSS98489N', '59013 Randi Squares\nNorth Cullen, ID 45302-1914', '493 Theresia Harbors\nWest Carrollberg, TX 40754', 'South Violetteland', 'Washington', 'Armenia', '05637-5035', 1424.50, 2929.31, 7036.29, 4, 9886.60, 24, NULL, 'Customer', 'Wholesale', 'To Pay', 0, 'Architecto magnam id distinctio et.', '\"{\\\"ref_code\\\":\\\"TS9KI114\\\",\\\"loyalty_points\\\":172}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(53, 'CUST-KBC6KB', 'Jennifer Gaylord', 'murl91@example.com', '2642625174', '1394899908', 'Borer, Harris and Treutel', '64UEGI8035S1ZX', 'CACHH71814F', '2561 Cory Fork Apt. 460\nPourosside, MS 30857', '51946 Deshawn Hill Apt. 371\nNew Aishaland, AL 53454', 'East Jerryland', 'Connecticut', 'Brazil', '83604-9344', 3664.68, 1070.07, 1374.76, 6, 6941.72, 30, NULL, 'Supplier', 'Retail', 'To Pay', 1, 'Earum dolor excepturi quidem magnam et perferendis quaerat.', '\"{\\\"ref_code\\\":\\\"MGV3TXC7\\\",\\\"loyalty_points\\\":1}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(54, 'CUST-CMKVKW', 'Greg Mills I', 'lind.joelle@example.net', '5963925421', '9644171936', 'Raynor-Hagenes', '39MVXM1083I1ZV', 'FEJFZ18963M', '634 Brittany Freeway\nKeeblerberg, AL 70002', '47302 Deion Corners\nMetaland, NC 01747-1992', 'East Sandra', 'Utah', 'Slovenia', '70162-3962', 4115.14, 2491.74, 3475.73, 60, 4767.04, 14, '2025-08-10', 'Customer', 'Wholesale', 'To Collect', 1, 'Animi sunt quo ea quia culpa qui autem.', '\"{\\\"ref_code\\\":\\\"ZHNY42QC\\\",\\\"loyalty_points\\\":196}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(55, 'CUST-7WQJKR', 'Dr. Clark Beahan', 'wbatz@example.com', '9573557507', NULL, 'Bruen Group', '99TARB2072J1ZX', 'UGVBQ25697T', '5931 Wallace Expressway\nBorermouth, GA 38620-9405', '846 Fiona Road\nDantown, NE 58353', 'South Jerroldmouth', 'Maryland', 'Guinea-Bissau', '73392-5731', 2670.48, 889.19, 1196.78, 26, 1708.73, 8, NULL, 'Customer', 'Wholesale', 'To Collect', 1, 'Suscipit aliquid est distinctio est non sint voluptatem.', '\"{\\\"ref_code\\\":\\\"PPOSBU8L\\\",\\\"loyalty_points\\\":181}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(56, 'CUST-50JVNN', 'Mr. Flavio Dicki DVM', 'mritchie@example.net', '2760779655', '2863561484', 'Herzog-Ondricka', '08QGAV8608N1ZF', 'TPBGU65476K', '601 Shirley Walks Apt. 203\nSouth Delilahshire, WA 36335', '27834 Conn Meadow\nRodstad, ID 00666-4093', 'Port Aditya', 'Wisconsin', 'Liberia', '32833-8354', 4356.25, 2900.75, 1329.54, 41, 4335.86, 19, '2025-08-23', 'Customer', 'Wholesale', 'To Pay', 1, 'Aliquam fugit nostrum minima optio temporibus doloribus officia.', '\"{\\\"ref_code\\\":\\\"ZRHJMIQ2\\\",\\\"loyalty_points\\\":186}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(57, 'CUST-9XWOWU', 'Marjory Hammes', 'brett54@example.com', '3608681207', '3446087544', 'Quigley-Predovic', '81FYLZ3612D1ZR', 'OBIFC26189H', '3063 Elvis Prairie\nNorth Ashly, MO 44372-1275', '1404 Abernathy Curve\nEast Berryview, KY 17804-6376', 'South Jackson', 'New York', 'United States of America', '45381-9785', 899.18, 1158.23, 8320.78, 29, 7568.44, 43, NULL, 'Supplier', 'Wholesale', 'To Collect', 1, 'Error aut illum voluptatem et quam consequatur.', '\"{\\\"ref_code\\\":\\\"7LWQVYMW\\\",\\\"loyalty_points\\\":82}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(58, 'CUST-DDH3AA', 'Adelle Littel', 'marlin.stehr@example.com', '5701694028', NULL, 'Torp, Bosco and Haag', '66QWSO8064Q1ZV', 'APHMY85587Y', '9720 Akeem Route\nWest Isobel, ME 26314-7627', '462 O\'Hara Roads Suite 970\nBrownland, KY 84534', 'McClureburgh', 'West Virginia', 'Bahrain', '67935-9015', 327.57, 68.49, 9139.51, 1, 8447.13, 17, '2025-08-26', 'Customer', 'Wholesale', 'To Collect', 0, 'Vitae sit sequi omnis laudantium.', '\"{\\\"ref_code\\\":\\\"N8KYCBKV\\\",\\\"loyalty_points\\\":105}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(59, 'CUST-KCKVNZ', 'Estelle Kuhn', 'streich.lila@example.org', '2012678505', NULL, 'Wiegand, Hilpert and Huel', '52JQJI2781C1ZZ', 'GITGB05776J', '5869 Fermin Valley\nEast Dereckfort, OH 92579', '6253 Cummerata Courts\nTysonfurt, NH 74098', 'Port Maci', 'West Virginia', 'Switzerland', '74859-6062', 26.07, 3005.99, 1753.20, 33, 1158.54, 6, '2025-07-13', 'Supplier', 'Retail', 'To Collect', 1, 'Tempora et voluptatibus iure quam voluptas.', '\"{\\\"ref_code\\\":\\\"ROGYG0NU\\\",\\\"loyalty_points\\\":29}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(60, 'CUST-MBM0ZB', 'Cornell Hill', 'christine15@example.net', '3261968226', NULL, 'Bashirian and Sons', '08SKMN0536E1ZI', 'UBTZE93261U', '234 Veum Radial Suite 112\nNew Mustafamouth, WI 65826', '33737 Garfield Overpass\nPort Giuseppeland, UT 31232-8108', 'Gabriellaborough', 'Nevada', 'Ghana', '96609-5235', 1572.27, 3824.68, 2576.08, 17, 8260.03, 41, '2025-08-19', 'Supplier', 'Wholesale', 'To Pay', 1, 'Recusandae eaque molestiae sed quia repellendus doloremque non praesentium.', '\"{\\\"ref_code\\\":\\\"2BNB6HBV\\\",\\\"loyalty_points\\\":154}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(61, 'CUST-XUOHYP', 'Mikel Stiedemann', 'stan28@example.com', '6607958523', NULL, 'Erdman-Feest', '92BWOE8104R1ZA', 'CWTAG39220N', '5763 Jacobson Junctions\nMarjolaineton, NE 38156-8270', '1136 Liliana Stravenue Suite 588\nNew Joesph, FL 08175', 'Herminioshire', 'Oregon', 'Nigeria', '21301', 2899.48, 4358.90, 4126.12, 22, 4447.68, 22, '2025-07-06', 'Supplier', 'Wholesale', 'To Collect', 1, 'Cum vel voluptatem sit repudiandae tenetur.', '\"{\\\"ref_code\\\":\\\"UMEK19AO\\\",\\\"loyalty_points\\\":123}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(62, 'CUST-CUQ4VM', 'Janae Lakin', 'ernie83@example.com', '2038635703', NULL, 'Bogisich, Spencer and Runte', '31VOFM3106J1ZZ', 'ZFTYW28803Q', '5960 Cassin Unions Apt. 994\nBorerville, OR 89782-9017', '6826 Sporer Pass\nJohnside, NC 64420-8055', 'Lake Gonzalochester', 'Minnesota', 'Paraguay', '04427-9100', 1208.07, 2692.27, 6101.14, 52, 2078.72, 24, '2025-09-17', 'Customer', 'Wholesale', 'To Collect', 1, 'In distinctio nihil vel cumque sit et minus magnam.', '\"{\\\"ref_code\\\":\\\"BYIVFNSC\\\",\\\"loyalty_points\\\":196}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(63, 'CUST-F4CC8J', 'Dr. Oscar Adams III', 'crona.isaias@example.org', '5071190657', '5890050799', 'Dibbert, Hilpert and Lockman', '08HXMV6401G1ZC', 'ECOFQ74088A', '108 Jazmyn Mills\nGibsonview, PA 40160-9219', '8769 Gaylord Spring Suite 577\nLake Roderick, DC 90559', 'Lake Alisonberg', 'Delaware', 'Israel', '13933-1982', 2747.44, 547.84, 2898.95, 34, 5108.83, 12, NULL, 'Supplier', 'Retail', 'To Pay', 1, 'Consectetur vero id mollitia corrupti.', '\"{\\\"ref_code\\\":\\\"WHNTQDGQ\\\",\\\"loyalty_points\\\":59}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(64, 'CUST-H4R3H3', 'Jasen O\'Conner Sr.', 'bernhard.zion@example.com', '5200671647', NULL, 'Sawayn, Toy and Reinger', '96FFTC6189U1ZE', 'UJSZE59812B', '602 Fausto Forge\nNew Abdullahberg, NJ 69997', '54727 Strosin Neck\nSouth Monserratshire, PA 09218', 'Mauricestad', 'Texas', 'Central African Republic', '45437', 554.06, 2718.31, 4868.19, 20, 957.75, 24, NULL, 'Supplier', 'Wholesale', 'To Collect', 1, 'Modi velit et tempora eaque qui id sed.', '\"{\\\"ref_code\\\":\\\"PR83NBRC\\\",\\\"loyalty_points\\\":174}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(65, 'CUST-3YAYHG', 'Mrs. Caterina O\'Connell', 'corkery.kyle@example.com', '3863615605', '2212393540', 'Jakubowski-Towne', '04UZEP7225N1ZN', 'DRYHU48248Z', '23921 Harold Highway\nPort Franceshaven, WI 27790', '119 Foster Corner Suite 331\nStammstad, VA 43352-8767', 'Shanaton', 'California', 'Barbados', '95864', 268.97, 2000.23, 658.95, 51, 3042.63, 23, NULL, 'Supplier', 'Retail', 'To Collect', 1, 'Vero deserunt dicta et aut.', '\"{\\\"ref_code\\\":\\\"CVGHUTH9\\\",\\\"loyalty_points\\\":177}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(66, 'CUST-JCXXPC', 'Anderson Jacobi', 'dejah33@example.com', '3167458592', '5445546699', 'Langworth-Bartoletti', '26XJQN0792C1ZT', 'GAZCN84649X', '97950 Freeda Locks Suite 355\nBrakusport, KS 04227', '13473 Kassulke Run\nZiemannshire, TN 18416-4646', 'Shawnashire', 'Tennessee', 'Montserrat', '84073', 43.69, 1670.02, 6275.85, 6, 225.85, 1, NULL, 'Supplier', 'Wholesale', 'To Pay', 1, 'Sit maiores beatae accusantium.', '\"{\\\"ref_code\\\":\\\"TRR3S7ZL\\\",\\\"loyalty_points\\\":16}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(67, 'CUST-FVTX8U', 'Dr. Brice Wisoky', 'taurean.rohan@example.com', '0777701617', '7997298486', 'Breitenberg-Metz', '84ZQAX2193X1ZA', 'FIJHW47168X', '6719 Kylee Forest Apt. 048\nDietrichhaven, NC 21019', '97328 Hansen Fields\nSchmelerbury, HI 64533-0179', 'Lake Ciceroborough', 'Rhode Island', 'Samoa', '60401-7091', 2996.08, 472.58, 5894.91, 12, 9959.63, 18, NULL, 'Customer', 'Retail', 'To Pay', 1, 'Dignissimos optio modi assumenda odit provident magnam.', '\"{\\\"ref_code\\\":\\\"0XSR9QXI\\\",\\\"loyalty_points\\\":109}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(68, 'CUST-FT8N89', 'Shemar Kutch', 'karolann06@example.net', '8110109857', '9117562668', 'Wilkinson LLC', '04GTSW2700T1ZY', 'ITRBM49495E', '73715 Maeve Drive\nEast Lucianochester, CT 86631-3441', '4290 Carli Court\nEast Maribel, WI 61753', 'Maryjaneport', 'Rhode Island', 'South Georgia and the South Sandwich Islands', '30079', 2419.39, 2700.33, 4487.09, 44, 2765.86, 23, NULL, 'Supplier', 'Wholesale', 'To Collect', 0, 'Quis enim aliquam quaerat earum.', '\"{\\\"ref_code\\\":\\\"4M0Y8JET\\\",\\\"loyalty_points\\\":91}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(69, 'CUST-XPIY6R', 'Aliyah Dietrich', 'keaton42@example.com', '2849782073', '2781518620', 'Huels, Kuhic and Gutmann', '33XOHG7495X1ZV', 'SSTWM60661L', '738 Wehner Valleys\nTowneton, MI 72098-7769', '3991 Teagan Flat Apt. 228\nDixiemouth, VT 95049', 'North Kristyport', 'Nevada', 'Uruguay', '26660-6786', 1203.07, 957.76, 3194.89, 22, 2873.30, 0, '2025-07-22', 'Customer', 'Wholesale', 'To Collect', 1, 'Consequuntur nisi alias eum.', '\"{\\\"ref_code\\\":\\\"XCMYKC2D\\\",\\\"loyalty_points\\\":32}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(70, 'CUST-JZNUMY', 'Aliza Langworth I', 'haley20@example.com', '8814402059', '7607046158', 'Breitenberg-Simonis', '22JVWW6491C1ZA', 'RMCPV92833Y', '375 Christiana Bridge\nPort Myrtleland, HI 46806-5611', '8388 Bashirian Mount\nLittelport, ND 07682', 'South Stuarthaven', 'Maryland', 'Sri Lanka', '51283-0833', 3200.67, 2808.47, 3361.84, 50, 9700.42, 47, '2025-06-20', 'Customer', 'Wholesale', 'To Pay', 1, 'Enim itaque voluptatum et deleniti vel non dolor.', '\"{\\\"ref_code\\\":\\\"PT6E8DES\\\",\\\"loyalty_points\\\":18}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(71, 'CUST-RHNL0S', 'Shanna Gaylord', 'eziemann@example.com', '7701642642', '5885829347', 'Considine-DuBuque', '08YFXK3522L1ZG', 'UELXP12423Y', '785 Julia Locks Suite 295\nNicholestad, NY 75680-9965', '8439 Jennings Junction\nNew Olen, PA 91642', 'South Dulce', 'Minnesota', 'Rwanda', '95559-7671', 1519.25, 3166.55, 7014.49, 12, 3210.35, 47, NULL, 'Customer', 'Retail', 'To Pay', 1, 'Perspiciatis nihil est quidem fugit aliquid.', '\"{\\\"ref_code\\\":\\\"ZLRFRYX1\\\",\\\"loyalty_points\\\":89}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(72, 'CUST-ZTI9LV', 'Dr. Maudie Armstrong II', 'connie.fadel@example.com', '3016723471', '2415575487', 'Bartoletti LLC', '51EPZM4546I1ZG', 'ACEBR58503N', '7412 Gutkowski Manor Apt. 610\nWest Torranceside, DE 15911-5248', '91073 Donald Oval Suite 542\nEast Neldatown, PA 70017-9191', 'Zacharyville', 'Illinois', 'Serbia', '96990-3221', 4163.44, 3356.88, 9377.17, 53, 46.81, 10, '2025-05-10', 'Supplier', 'Retail', 'To Pay', 1, 'Nisi ut voluptatum distinctio magnam cumque.', '\"{\\\"ref_code\\\":\\\"MD8WWHWW\\\",\\\"loyalty_points\\\":138}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(73, 'CUST-KW4TIQ', 'Zena Hickle Sr.', 'vryan@example.com', '5580716227', '9327531042', 'Tremblay, Crona and Schoen', '56RUIV6978U1ZH', 'QVKKR16942T', '40036 Andreanne Expressway\nLake Elliottown, DC 19122', '3945 Gerard Center Suite 898\nVeronicaport, HI 11128', 'Jeremiebury', 'Ohio', 'Thailand', '56910', 4776.61, 2543.83, 8829.64, 57, 4252.41, 24, NULL, 'Customer', 'Retail', 'To Collect', 1, 'Odio quae est repellat sequi.', '\"{\\\"ref_code\\\":\\\"ZJVHP9C2\\\",\\\"loyalty_points\\\":36}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(74, 'CUST-COCEOG', 'Prof. Jaeden Spencer Jr.', 'jkris@example.org', '7872726211', NULL, 'Jast, Corkery and Rau', '87TEVH3217X1ZE', 'KZMOA69216Q', '54651 Will Oval\nSouth Odabury, NE 05943', '37636 Stanton Throughway Suite 843\nRebekahport, OK 18713-0523', 'Lake Jody', 'West Virginia', 'Holy See (Vatican City State)', '27869', 1852.51, 1979.15, 2079.37, 59, 6587.14, 28, NULL, 'Supplier', 'Retail', 'To Pay', 1, 'Dolorem pariatur reiciendis accusantium voluptatibus.', '\"{\\\"ref_code\\\":\\\"O1UVHA1L\\\",\\\"loyalty_points\\\":16}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(75, 'CUST-GHVKLQ', 'Maryam Crist', 'mohammad.zulauf@example.com', '2768466151', NULL, 'Barton PLC', '55SYFU7460M1ZB', 'YVMFV51861O', '98145 Jacobs Isle\nJovanybury, WV 13732', '547 Estel Port\nBartellshire, OR 35596-1332', 'Antwanberg', 'Mississippi', 'Oman', '17569', 469.82, 3435.36, 4853.78, 55, 2727.37, 6, NULL, 'Supplier', 'Retail', 'To Pay', 1, 'Dolorem laborum sapiente modi debitis quae eum qui.', '\"{\\\"ref_code\\\":\\\"HVWKWQQD\\\",\\\"loyalty_points\\\":187}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(76, 'CUST-NX2B9L', 'Eleazar Emmerich MD', 'breitenberg.maxime@example.org', '2420179466', NULL, 'Hirthe and Sons', '94IWRF3503G1ZU', 'DNWFJ51965P', '105 O\'Conner Route\nWilfredland, NH 88764', '74609 Randal Lights Suite 139\nWest Abbey, OH 18628', 'Weissnatside', 'New York', 'Luxembourg', '37013-3422', 2380.10, 4493.77, 7977.23, 2, 6240.96, 21, NULL, 'Supplier', 'Wholesale', 'To Collect', 1, 'Fuga quasi veniam saepe dolorem eum velit.', '\"{\\\"ref_code\\\":\\\"QGLQ7KAI\\\",\\\"loyalty_points\\\":187}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(77, 'CUST-4FZ2DE', 'Ms. Telly Macejkovic V', 'quigley.esmeralda@example.com', '9515350739', '7272303569', 'Toy-Balistreri', '70JLUW4803S1ZS', 'OCNPZ33751D', '3382 McClure Coves\nPort Gayle, SD 51400-1643', '167 Bria Circle\nJarenberg, MA 25724', 'East Henry', 'Arizona', 'Macao', '34510', 1550.90, 713.74, 7371.08, 9, 5593.72, 50, '2025-08-08', 'Supplier', 'Retail', 'To Collect', 1, 'Reiciendis possimus recusandae est et distinctio tempora.', '\"{\\\"ref_code\\\":\\\"YVIVOP24\\\",\\\"loyalty_points\\\":154}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(78, 'CUST-RTJPFP', 'Kiel Upton MD', 'cummerata.ottilie@example.net', '3274158369', '9587695080', 'Reynolds PLC', '23DETR5575E1ZW', 'QPEKC32371N', '24381 Jayson Lodge\nNew Loycefort, KY 53753', '743 Dimitri Valleys Apt. 109\nVitoview, IA 91573', 'Germaineborough', 'New Mexico', 'Suriname', '75797', 932.70, 3546.61, 7351.23, 7, 3529.87, 33, NULL, 'Customer', 'Wholesale', 'To Collect', 1, 'Ea ut totam quia.', '\"{\\\"ref_code\\\":\\\"1F4QOYXA\\\",\\\"loyalty_points\\\":1}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(79, 'CUST-KH4MOW', 'Samir Lynch', 'armando88@example.org', '1549768349', NULL, 'Ernser, Pouros and McClure', '75ERQV3004G1ZA', 'VXCML47138D', '66585 Alexie Land Apt. 484\nEast Lennaberg, AR 14118', '93182 Stephen Springs\nWatsicafort, MA 43255-0794', 'Lake Jaylin', 'South Carolina', 'Austria', '85303', 158.14, 4736.25, 4204.17, 46, 6524.48, 23, '2025-10-30', 'Supplier', 'Wholesale', 'To Collect', 1, 'Et illo omnis est distinctio quo.', '\"{\\\"ref_code\\\":\\\"PVVRSYNJ\\\",\\\"loyalty_points\\\":190}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(80, 'CUST-RH2JKN', 'Sanford Herman II', 'hwintheiser@example.org', '8004150643', NULL, 'Luettgen Inc', '92CXYP8769Y1ZI', 'FDYFG29411W', '87472 Emil Route Apt. 592\nTowneview, WI 87554', '2515 Rodger Cliff\nNew Jadeside, NY 84874-6691', 'West Katlynnberg', 'Texas', 'Poland', '67275', 3578.28, 3993.77, 3502.33, 7, 6367.01, 5, NULL, 'Customer', 'Wholesale', 'To Collect', 1, 'Et sit aspernatur rem praesentium modi illo.', '\"{\\\"ref_code\\\":\\\"JUZU6B4U\\\",\\\"loyalty_points\\\":185}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(81, 'CUST-3RVWMV', 'Jo Davis', 'leon08@example.com', '0894458639', NULL, 'Conn-Dibbert', '97AMNJ5370E1ZM', 'KKUPK74150T', '2010 Edwardo Wells Apt. 060\nLake Marlonchester, WA 39333-8423', '51033 Klein Ramp\nNew Dewayneborough, IA 56226', 'Alejandrafort', 'Florida', 'Peru', '57752-8421', 2404.29, 2047.44, 5511.95, 24, 302.65, 43, NULL, 'Customer', 'Wholesale', 'To Pay', 1, 'Et amet mollitia dolor esse.', '\"{\\\"ref_code\\\":\\\"FNCBMVG8\\\",\\\"loyalty_points\\\":71}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(82, 'CUST-BX6EI3', 'Thelma Shanahan IV', 'qrussel@example.org', '0697736190', NULL, 'Muller Inc', '89GITF8930S1ZU', 'BSRFC85483J', '29283 O\'Reilly Crest Apt. 140\nEudoramouth, CT 21459', '17109 Katlyn Hills\nNorth Don, IN 82853-0967', 'Marianneview', 'Nebraska', 'Fiji', '19790', 4974.10, 3351.01, 2331.14, 16, 2589.60, 18, '2025-08-06', 'Supplier', 'Retail', 'To Collect', 1, 'Esse consequatur quasi unde inventore nam quia tenetur.', '\"{\\\"ref_code\\\":\\\"Y2HXSQ6E\\\",\\\"loyalty_points\\\":44}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(83, 'CUST-ARQFOO', 'Bulah Rippin', 'emann@example.org', '0927818262', '7994711727', 'Veum, Durgan and Parisian', '46SRKC8572L1ZT', 'IJZAI30619M', '4235 Calista Stravenue Suite 124\nDuBuqueland, HI 14686', '44737 Ruthie Ford Suite 264\nEast Demarco, HI 66260', 'Charlieland', 'Florida', 'Saint Helena', '64434', 337.99, 322.36, 154.48, 47, 9357.69, 18, NULL, 'Supplier', 'Wholesale', 'To Collect', 1, 'Facilis ex est earum quidem laboriosam distinctio.', '\"{\\\"ref_code\\\":\\\"LSUUAPJT\\\",\\\"loyalty_points\\\":145}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(84, 'CUST-H2EIK4', 'Myah Rau I', 'thompson.napoleon@example.org', '0559764883', NULL, 'Hamill-Sipes', '33OSRM5171O1ZL', 'LXYXS90865X', '671 Charles Island Suite 220\nPort Terryville, FL 58822', '78214 O\'Kon Throughway\nSouth Edwardhaven, OK 92121', 'Dibbertshire', 'Arizona', 'Puerto Rico', '27461', 837.21, 1643.81, 5435.32, 55, 1662.13, 33, '2025-08-14', 'Customer', 'Retail', 'To Collect', 1, 'Omnis dolores maiores in tempora architecto.', '\"{\\\"ref_code\\\":\\\"BEI8LBER\\\",\\\"loyalty_points\\\":66}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(85, 'CUST-1OS9LA', 'Aliyah Schulist V', 'mayer.kolby@example.net', '2590089245', '9042458720', 'Cruickshank, Gibson and Armstrong', '00CZGN2275E1ZI', 'KSLAS08844A', '6715 Sunny Track Suite 965\nAubreefurt, MA 19970', '480 Kayden Junctions Apt. 814\nWuckertland, VA 84643-4290', 'New Dashawnhaven', 'Virginia', 'Denmark', '73253-1982', 1705.09, 3149.92, 9539.75, 35, 9138.89, 36, NULL, 'Customer', 'Wholesale', 'To Collect', 1, 'Doloribus suscipit pariatur qui qui delectus.', '\"{\\\"ref_code\\\":\\\"BVLAEUQH\\\",\\\"loyalty_points\\\":141}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(86, 'CUST-SCRROM', 'Mr. Moses Gutkowski Sr.', 'epollich@example.org', '5300262820', '1392561782', 'McLaughlin, Langworth and McCullough', '01BWBI7553O1ZK', 'BGLYS03481G', '7493 Leda Flat\nWest Gerry, HI 92865-1432', '7378 O\'Reilly Harbor Suite 729\nRueckerborough, MS 80612', 'Okunevaton', 'New Hampshire', 'Slovakia (Slovak Republic)', '85650-2500', 1278.33, 1778.16, 898.85, 24, 7900.18, 18, NULL, 'Supplier', 'Retail', 'To Pay', 0, 'Et ipsum non ad.', '\"{\\\"ref_code\\\":\\\"GCEQXCB2\\\",\\\"loyalty_points\\\":90}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(87, 'CUST-QBRYE0', 'Mrs. Berniece Turcotte', 'smith.lisa@example.net', '8930969813', NULL, 'McDermott, Nader and Dicki', '35VZBN9428X1ZO', 'ITPPY51480Q', '46797 Alphonso Gateway Apt. 458\nLake Sincere, NM 13789-5797', '169 Demetris Extension\nCristview, IN 17810', 'West Wyman', 'Arizona', 'Cape Verde', '96104', 4047.71, 4626.63, 8843.53, 48, 3418.89, 28, NULL, 'Supplier', 'Wholesale', 'To Pay', 0, 'Sed alias dolore sed rem quae nihil assumenda.', '\"{\\\"ref_code\\\":\\\"AUEFKJ0Y\\\",\\\"loyalty_points\\\":157}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(88, 'CUST-MBFN6D', 'Vladimir Tremblay', 'marcellus88@example.com', '6123646047', '8034101873', 'Morissette PLC', '26QFGI8727Y1ZE', 'VTSER05816Q', '15125 Quigley Overpass Suite 444\nLake Nikoburgh, NY 27302', '209 Emelia Trafficway\nColliermouth, UT 67192-3881', 'Thereseport', 'New Hampshire', 'Guam', '19367-7419', 481.01, 1418.21, 6009.90, 60, 7759.17, 5, NULL, 'Customer', 'Retail', 'To Pay', 1, 'Ea est facere nemo corrupti ut adipisci in.', '\"{\\\"ref_code\\\":\\\"SSINFNMY\\\",\\\"loyalty_points\\\":172}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22');
INSERT INTO `customers` (`id`, `customer_code`, `name`, `email`, `phone`, `alternate_phone`, `company_name`, `gstin`, `pan`, `billing_address`, `shipping_address`, `city`, `state`, `country`, `zip_code`, `opening_balance`, `current_balance`, `credit_limit`, `payment_terms`, `total_purchases`, `total_orders`, `last_order_date`, `customer_type`, `category`, `balance_type`, `is_active`, `notes`, `custom_fields`, `business_id`, `created_at`, `updated_at`) VALUES
(89, 'CUST-PI3WYY', 'Winfield Hamill DDS', 'ikirlin@example.org', '3598828485', '4900973963', 'Lang-Kiehn', '52NHMX8712A1ZS', 'JNKVR87711Q', '64891 Wendy Light\nKovacekville, NE 19009-2517', '555 Johnson Fall Apt. 415\nLake Gayle, AL 01024', 'Angelicaberg', 'Mississippi', 'Eritrea', '90198-7084', 1937.97, 4187.72, 3975.65, 2, 4529.50, 30, NULL, 'Customer', 'Retail', 'To Collect', 1, 'Rerum vero perferendis quaerat excepturi repudiandae itaque modi.', '\"{\\\"ref_code\\\":\\\"LELFFLID\\\",\\\"loyalty_points\\\":13}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(90, 'CUST-V5DMJR', 'Jude Wisoky', 'zconn@example.org', '3699949324', '1720846516', 'Schneider-Dach', '95ADOQ4474U1ZZ', 'CQNTP00617V', '3289 Quigley Summit Apt. 366\nSouth Hayden, CA 03775-9588', '848 Moshe Crest Apt. 808\nGabriellefort, LA 97457', 'Fritzfurt', 'Tennessee', 'Ecuador', '65594', 3801.05, 3445.74, 205.58, 39, 4426.91, 2, NULL, 'Customer', 'Retail', 'To Collect', 1, 'Quasi nihil ut vel quibusdam sed qui dolor.', '\"{\\\"ref_code\\\":\\\"RJ2M1WN6\\\",\\\"loyalty_points\\\":4}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(91, 'CUST-LKNWM0', 'Maxie Nicolas', 'bradtke.ambrose@example.com', '7105250455', NULL, 'Gulgowski, Sawayn and McClure', '80HZGR1004W1ZT', 'LQEPL16199X', '2166 Samanta Lane Apt. 662\nMariobury, DE 02552', '39839 Evert Crossroad Suite 732\nEleazarville, TN 67604', 'VonRuedenland', 'Michigan', 'Luxembourg', '03458-7340', 4311.57, 1858.17, 3031.51, 1, 4756.20, 7, '2025-05-29', 'Customer', 'Retail', 'To Collect', 1, 'Iure blanditiis sed laudantium officiis velit.', '\"{\\\"ref_code\\\":\\\"QGI7LHTD\\\",\\\"loyalty_points\\\":60}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(92, 'CUST-4VT43V', 'Mr. Okey Johnston', 'dcasper@example.org', '2384701200', '9144296204', 'Kautzer Inc', '46KFOB8739G1ZM', 'MSSCU62954H', '7607 Wintheiser Causeway Suite 610\nNorth Bentonmouth, NE 37134', '8366 Koch Ports Apt. 574\nWest Wilhelmhaven, WY 54928-5580', 'West Cassandre', 'Oklahoma', 'Timor-Leste', '43657-0983', 4555.38, 2563.41, 2254.31, 35, 9666.55, 6, NULL, 'Supplier', 'Retail', 'To Collect', 1, 'Architecto mollitia laudantium optio qui tempora et impedit.', '\"{\\\"ref_code\\\":\\\"BJPODM45\\\",\\\"loyalty_points\\\":121}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(93, 'CUST-S667QY', 'Myrtis Trantow', 'ymills@example.net', '0740540999', NULL, 'Nienow and Sons', '64GAFI0458U1ZK', 'BNFUW02667K', '890 Hane Parkways Apt. 250\nRauberg, CT 90985', '2606 Marvin Island Suite 615\nWest Soledad, NH 56758', 'Orenfort', 'North Carolina', 'Tonga', '78251', 2628.46, 3576.50, 8346.14, 22, 5306.59, 2, '2025-06-08', 'Customer', 'Retail', 'To Collect', 1, 'Et ut quasi iste nihil quasi.', '\"{\\\"ref_code\\\":\\\"LOFSCVYB\\\",\\\"loyalty_points\\\":57}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(94, 'CUST-H0WAVE', 'Dr. Bryce Sawayn', 'fbernhard@example.com', '1686057167', '7388822024', 'Klein and Sons', '56IPWB5555R1ZV', 'TQXIF32271R', '345 Vito Land Apt. 762\nNew Elisa, ND 35213-3952', '69383 Augustus Square Apt. 765\nWest Aisha, MT 78607', 'Lake Bernhardtown', 'Illinois', 'Myanmar', '97086', 2986.65, 4515.42, 5440.66, 43, 5264.53, 15, '2025-06-28', 'Supplier', 'Wholesale', 'To Collect', 1, 'Aut explicabo sed laborum.', '\"{\\\"ref_code\\\":\\\"GEJZF01M\\\",\\\"loyalty_points\\\":162}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(95, 'CUST-5NUR0A', 'Isobel Braun', 'schowalter.helena@example.org', '2128471978', '5170197136', 'Swaniawski Ltd', '54RDDR4719Z1ZL', 'CQWFB76096C', '331 Sarai Drives Suite 823\nPrudencemouth, DC 52295', '48329 Jeremie Islands Suite 823\nZiemeview, UT 44787', 'New Gordon', 'New Hampshire', 'Liechtenstein', '30402', 4499.04, 3190.33, 4979.23, 41, 1738.39, 10, NULL, 'Supplier', 'Wholesale', 'To Pay', 1, 'Dignissimos rerum odio in ut.', '\"{\\\"ref_code\\\":\\\"5UFDO8UF\\\",\\\"loyalty_points\\\":155}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(96, 'CUST-KTFSRZ', 'Dorothy Mayer', 'heathcote.anabel@example.com', '9242551505', NULL, 'Strosin-Abbott', '32QNLE7195J1ZJ', 'QWJOP86516O', '9270 Haley Mission\nRyleeburgh, VT 41478', '60867 Wilbert Views\nBarrowsside, SD 95151', 'West Lilyland', 'Wisconsin', 'Antigua and Barbuda', '63274', 1213.35, 1090.77, 3094.74, 16, 5001.15, 0, NULL, 'Supplier', 'Wholesale', 'To Collect', 1, 'Vel necessitatibus voluptatem iusto delectus.', '\"{\\\"ref_code\\\":\\\"NRL7JYIF\\\",\\\"loyalty_points\\\":39}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(97, 'CUST-6IKJB8', 'Demario Williamson V', 'estella.adams@example.net', '2364781828', '0743302986', 'Gorczany Ltd', '14WEUE2109Y1ZR', 'DCENR51831R', '948 Clotilde Stream\nWest Nadia, NH 66559', '6870 Adams Trafficway\nThompsonton, NC 06302', 'Lake Bruce', 'Florida', 'Germany', '19246-9812', 2068.89, 2863.47, 4513.06, 49, 4866.98, 36, '2025-08-29', 'Supplier', 'Retail', 'To Pay', 1, 'Atque laborum ipsum doloribus et reiciendis.', '\"{\\\"ref_code\\\":\\\"NZ4BB6SY\\\",\\\"loyalty_points\\\":184}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(98, 'CUST-MDQWQB', 'Winifred Boehm', 'aniyah91@example.com', '6257987698', NULL, 'Anderson-Nikolaus', '46GCSL2812V1ZK', 'CDBSJ90818F', '6379 Alf River Suite 937\nLucyfurt, UT 61061-2066', '2809 Jerod Glens\nNathenfort, NE 08594', 'West Rozella', 'New Jersey', 'Saint Vincent and the Grenadines', '21347-5751', 1362.06, 3139.47, 8234.09, 29, 4852.69, 29, NULL, 'Customer', 'Wholesale', 'To Pay', 1, 'Omnis dolorum placeat et ut quod ipsum sint earum.', '\"{\\\"ref_code\\\":\\\"QFV3Q7SM\\\",\\\"loyalty_points\\\":171}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(99, 'CUST-ERDL3J', 'Delilah Kuhic DVM', 'afranecki@example.net', '2264248292', '0636605891', 'Spencer PLC', '01OITO5655G1ZZ', 'EDNPL79148E', '16638 Katelin Lock\nPadbergchester, AL 63108-1677', '4139 Hilda Rue\nPort Antonetta, VT 84076-4531', 'Gradyport', 'New Hampshire', 'Senegal', '31589', 598.01, 311.38, 73.45, 25, 3856.62, 18, NULL, 'Customer', 'Retail', 'To Pay', 0, 'In in accusantium et sed inventore ullam.', '\"{\\\"ref_code\\\":\\\"X1DM5TYG\\\",\\\"loyalty_points\\\":168}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(100, 'CUST-X7JDIY', 'Meaghan Altenwerth Sr.', 'hkautzer@example.com', '1535658087', '2588828801', 'Bogisich Group', '69YYJG6284L1ZY', 'TBBFW63301W', '42868 Turner Port\nWest Virginia, IN 79452-0087', '22331 Turner Curve\nSouth Kenyattaton, KS 53236-3425', 'Daughertyberg', 'New Hampshire', 'Belgium', '14627-3522', 3909.46, 157.59, 4226.98, 38, 5057.69, 26, NULL, 'Supplier', 'Wholesale', 'To Collect', 1, 'Quia consequuntur explicabo tempora doloribus cumque.', '\"{\\\"ref_code\\\":\\\"KVEZ7RHJ\\\",\\\"loyalty_points\\\":194}\"', 3, '2025-11-08 19:21:22', '2025-11-08 19:21:22'),
(101, 'CUS-0101', 'dsafdsafdsa', NULL, '7832892132', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'India', NULL, 0.00, 0.00, 0.00, 30, 0.00, 0, NULL, 'regular', NULL, 'To Collect', 1, NULL, '\"{\\\"birthday\\\":null,\\\"drug_license\\\":null,\\\"bank_accounts\\\":[]}\"', 3, '2025-11-09 08:41:03', '2025-11-09 08:41:03'),
(102, 'CUS-0102', 'dsafdsaf', NULL, '3223332322332', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'India', NULL, 0.00, 0.00, 0.00, 30, 0.00, 0, NULL, 'regular', NULL, 'To Collect', 1, NULL, '\"{\\\"birthday\\\":null,\\\"drug_license\\\":null,\\\"bank_accounts\\\":[]}\"', 3, '2025-11-11 00:28:24', '2025-11-11 00:28:24'),
(103, 'CUS-0103', 'dsafdsaf', NULL, '3223332322332', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'India', NULL, 0.00, 0.00, 0.00, 30, 0.00, 0, NULL, 'regular', NULL, 'To Collect', 1, NULL, '\"{\\\"birthday\\\":null,\\\"drug_license\\\":null,\\\"bank_accounts\\\":[]}\"', 3, '2025-11-11 00:30:10', '2025-11-11 00:30:10'),
(105, 'CUS-0104', 'Naveen Thapa', NULL, '7832892132', NULL, NULL, NULL, NULL, '{\"street\":null,\"state\":null,\"pincode\":null,\"city\":null}', '{\"street\":null,\"state\":null,\"pincode\":null,\"city\":null}', NULL, NULL, 'India', NULL, 0.00, 0.00, 0.00, 0, 0.00, 0, NULL, 'regular', NULL, 'To Collect', 1, NULL, '\"{\\\"birthday\\\":null,\\\"drug_license\\\":null,\\\"bank_accounts\\\":[]}\"', 3, '2025-11-11 03:37:07', '2025-11-11 03:37:07'),
(106, 'CUS-0106', 'Deepika Thapa', NULL, '9736619703', NULL, NULL, NULL, NULL, '{\"street\":\"3rd Floor, Fatehpur Bridge, Near Fatehpur Bus Stand,Yol Road\",\"state\":\"Himachal Pradesh\",\"pincode\":\"176057\",\"city\":\"Dharamshala\"}', '{\"street\":\"3rd Floor, Fatehpur Bridge, Near Fatehpur Bus Stand,Yol Road\",\"state\":\"Himachal Pradesh\",\"pincode\":\"176057\",\"city\":\"Dharamshala\"}', NULL, NULL, 'India', NULL, 0.00, 0.00, 0.00, 0, 0.00, 0, NULL, 'regular', NULL, 'To Collect', 1, NULL, '\"{\\\"birthday\\\":null,\\\"drug_license\\\":null,\\\"bank_accounts\\\":[]}\"', 3, '2025-11-11 03:40:26', '2025-11-11 03:40:26'),
(107, 'CUS-0107', 'dsafdsaf', NULL, '32423424322', NULL, NULL, NULL, NULL, '{\"street\":\"\",\"state\":\"\",\"pincode\":\"\",\"city\":\"\"}', '{\"street\":\"\",\"state\":\"\",\"pincode\":\"\",\"city\":\"\"}', NULL, NULL, 'India', NULL, 0.00, 0.00, 0.00, 0, 0.00, 0, NULL, 'regular', NULL, 'To Collect', 1, NULL, '\"{\\\"birthday\\\":null,\\\"drug_license\\\":null,\\\"bank_accounts\\\":[]}\"', 3, '2025-11-11 05:41:52', '2025-11-11 05:41:52'),
(108, 'CUS-0108', 'Rohit Sharma', NULL, '8219827746', NULL, NULL, NULL, NULL, '{\"street\":\"\",\"state\":\"\",\"pincode\":\"\",\"city\":\"\"}', '{\"street\":\"\",\"state\":\"\",\"pincode\":\"\",\"city\":\"\"}', NULL, NULL, 'India', NULL, 0.00, 0.00, 0.00, 0, 0.00, 0, NULL, 'regular', NULL, 'To Collect', 1, NULL, '\"{\\\"birthday\\\":null,\\\"drug_license\\\":null,\\\"bank_accounts\\\":[]}\"', 3, '2025-11-11 05:42:23', '2025-11-11 05:42:23'),
(109, 'CUS-0109', 'Sachin Sharma', NULL, '8219827746', NULL, NULL, NULL, NULL, '{\"street\":\"\",\"state\":\"\",\"pincode\":\"\",\"city\":\"\"}', '{\"street\":\"\",\"state\":\"\",\"pincode\":\"\",\"city\":\"\"}', NULL, NULL, 'India', NULL, 0.00, 0.00, 0.00, 0, 0.00, 0, NULL, 'regular', NULL, 'To Collect', 1, NULL, '\"{\\\"birthday\\\":null,\\\"drug_license\\\":null,\\\"bank_accounts\\\":[]}\"', 3, '2025-11-11 05:43:46', '2025-11-11 05:43:46'),
(110, 'CUS-0110', 'fsdafd', NULL, '32432432432', NULL, NULL, NULL, NULL, '{\"street\":\"\",\"state\":\"\",\"pincode\":\"\",\"city\":\"\"}', '{\"street\":\"\",\"state\":\"\",\"pincode\":\"\",\"city\":\"\"}', NULL, NULL, 'India', NULL, 0.00, 0.00, 0.00, 0, 0.00, 0, NULL, 'regular', NULL, 'To Collect', 1, NULL, '\"{\\\"birthday\\\":null,\\\"drug_license\\\":null,\\\"bank_accounts\\\":[]}\"', 3, '2025-11-11 05:46:54', '2025-11-11 05:46:54'),
(111, 'CUS-0111', 'Sachin Sharma', NULL, '8219827746', NULL, NULL, NULL, NULL, '{\"street\":\"Billing Address here\",\"state\":\"Himachal Pradesh\",\"city\":\"Kangra\",\"pincode\":\"176057\"}', '{\"street\":\"Billing Address here\",\"state\":\"Himachal Pradesh\",\"city\":\"Kangra\",\"pincode\":\"176057\"}', NULL, NULL, 'India', NULL, 0.00, 0.00, 0.00, 0, 0.00, 0, NULL, 'regular', NULL, 'To Collect', 1, NULL, '\"{\\\"birthday\\\":null,\\\"drug_license\\\":null,\\\"bank_accounts\\\":[]}\"', 3, '2025-11-11 06:31:34', '2025-11-11 06:31:34'),
(112, 'CUS-0112', 'Rajesh Kumar', NULL, '3939393939', NULL, NULL, NULL, NULL, '{\"street\":\"dsafdasfdafdssadsafdsa\",\"state\":\"Himachal Pradesh\",\"city\":\"Kangra\",\"pincode\":\"176057\"}', '{\"street\":\"dsafdasfdafdssadsafdsa\",\"state\":\"Himachal Pradesh\",\"city\":\"Kangra\",\"pincode\":\"176057\"}', NULL, NULL, 'India', NULL, 0.00, 0.00, 0.00, 0, 0.00, 0, NULL, 'regular', NULL, 'To Collect', 1, NULL, '\"{\\\"birthday\\\":null,\\\"drug_license\\\":null,\\\"bank_accounts\\\":[]}\"', 3, '2025-11-12 01:38:23', '2025-11-12 01:38:23');

-- --------------------------------------------------------

--
-- Table structure for table `estimates`
--

CREATE TABLE `estimates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `estimate_number` varchar(255) NOT NULL,
  `reference_number` varchar(255) DEFAULT NULL,
  `estimate_date` date NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` enum('draft','sent','viewed','accepted','rejected','expired','converted') NOT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `shipping_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `taxable_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cgst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sgst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `igst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cess_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `notes` varchar(255) DEFAULT NULL,
  `terms_and_conditions` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `billing_address` varchar(255) DEFAULT NULL,
  `sent_date` date DEFAULT NULL,
  `accepted_date` date DEFAULT NULL,
  `rejected_date` date DEFAULT NULL,
  `rejection_reason` varchar(255) DEFAULT NULL,
  `is_draft` tinyint(1) NOT NULL DEFAULT 0,
  `is_expired` tinyint(1) NOT NULL DEFAULT 0,
  `is_converted` tinyint(1) NOT NULL DEFAULT 0,
  `converted_date` date DEFAULT NULL,
  `converted_to_type` varchar(255) DEFAULT NULL,
  `converted_to_id` bigint(20) DEFAULT NULL,
  `custom_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_fields`)),
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `estimate_items`
--

CREATE TABLE `estimate_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `item_type` varchar(255) NOT NULL DEFAULT 'product',
  `name` varchar(255) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity` decimal(10,3) NOT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `taxable_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `cgst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sgst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `igst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cess_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cgst_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `sgst_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `igst_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `cess_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `hsn_code` varchar(255) DEFAULT NULL,
  `tax_type` varchar(255) NOT NULL DEFAULT 'gst',
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attributes`)),
  `estimate_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `expense_number` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `expense_date` date NOT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `reference_number` varchar(255) DEFAULT NULL,
  `bill_number` varchar(255) DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `is_recurring` tinyint(1) NOT NULL DEFAULT 0,
  `recurring_frequency` varchar(255) DEFAULT NULL,
  `recurring_until` date DEFAULT NULL,
  `is_billable` tinyint(1) NOT NULL DEFAULT 0,
  `is_paid` tinyint(1) NOT NULL DEFAULT 1,
  `paid_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `custom_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_fields`)),
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `expense_category_id` bigint(20) UNSIGNED NOT NULL,
  `supplier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense_categories`
--

CREATE TABLE `expense_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `industry_types`
--

CREATE TABLE `industry_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `industry_types`
--

INSERT INTO `industry_types` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Agriculture', 'Farming, crop production, and related agricultural services', NULL, NULL),
(2, 'Automotive', 'Manufacture, sale, or repair of vehicles and auto parts', NULL, NULL),
(3, 'Banking & Finance', 'Financial institutions, loans, insurance, and investment services', NULL, NULL),
(4, 'Construction', 'Residential, commercial, and infrastructure construction projects', NULL, NULL),
(5, 'Consulting', 'Professional business and management consulting services', NULL, NULL),
(6, 'Consumer Goods', 'Production and sale of household or personal products', NULL, NULL),
(7, 'Education', 'Schools, colleges, training institutes, and e-learning platforms', NULL, NULL),
(8, 'Energy & Utilities', 'Power generation, renewable energy, and public utilities', NULL, NULL),
(9, 'Engineering', 'Civil, mechanical, and industrial engineering services', NULL, NULL),
(10, 'Entertainment & Media', 'Film, TV, music, publishing, and online media', NULL, NULL),
(11, 'Event Management', 'Event planning, coordination, and promotion services', NULL, NULL),
(12, 'E-commerce', 'Online retail and digital marketplace businesses', NULL, NULL),
(13, 'Fashion & Apparel', 'Clothing, footwear, and accessories manufacturing and sales', NULL, NULL),
(14, 'FMCG (Fast Moving Consumer Goods)', 'Quick-selling consumer products like food, beverages, toiletries', NULL, NULL),
(15, 'Food & Beverages', 'Restaurants, catering, packaged foods, and drinks', NULL, NULL),
(16, 'Healthcare', 'Hospitals, clinics, diagnostics, and health products', NULL, NULL),
(17, 'Hospitality', 'Hotels, resorts, and travel accommodation services', NULL, NULL),
(18, 'Information Technology', 'Software development, IT services, and SaaS platforms', NULL, NULL),
(19, 'Internet Services', 'Web hosting, digital marketing, and online platforms', NULL, NULL),
(20, 'Legal Services', 'Law firms, legal consultants, and arbitration services', NULL, NULL),
(21, 'Logistics & Transportation', 'Courier, freight, supply chain, and warehousing', NULL, NULL),
(22, 'Manufacturing', 'Production and assembly of industrial or consumer products', NULL, NULL),
(23, 'Mining & Metals', 'Extraction and processing of minerals and metals', NULL, NULL),
(24, 'Non-Profit & NGOs', 'Charitable and social welfare organizations', NULL, NULL),
(25, 'Oil & Gas', 'Exploration, refining, and distribution of petroleum and gas products', NULL, NULL),
(26, 'Pharmaceuticals', 'Drug research, development, and manufacturing companies', NULL, NULL),
(27, 'Printing & Publishing', 'Printing press, newspapers, and publishing houses', NULL, NULL),
(28, 'Real Estate', 'Property development, brokerage, and management', NULL, NULL),
(29, 'Retail', 'Supermarkets, convenience stores, and retail chains', NULL, NULL),
(30, 'Security Services', 'Private security, surveillance, and risk management', NULL, NULL),
(31, 'Telecommunications', 'Internet, mobile, and broadband service providers', NULL, NULL),
(32, 'Textiles', 'Fabric, garments, and textile product manufacturing', NULL, NULL),
(33, 'Tourism & Travel', 'Tour operators, travel agencies, and transport services', NULL, NULL),
(34, 'Trading', 'Wholesale, import-export, and commodity trading businesses', NULL, NULL),
(35, 'Agritech', 'Technology-driven agriculture and farming innovations', NULL, NULL),
(36, 'Fintech', 'Financial technology products and digital payment systems', NULL, NULL),
(37, 'Edtech', 'Online education and digital learning solutions', NULL, NULL),
(38, 'Healthtech', 'Healthcare software and device innovation companies', NULL, NULL),
(39, 'Insurtech', 'Insurance technology and digital risk management platforms', NULL, NULL),
(40, 'Real Estate Tech (Proptech)', 'Technology solutions for real estate and property management', NULL, NULL),
(41, 'Biotechnology', 'Biotech research and product development', NULL, NULL),
(42, 'Aerospace & Defense', 'Aircraft manufacturing, defense contracts, and space research', NULL, NULL),
(43, 'Chemicals', 'Chemical manufacturing, paints, and allied industries', NULL, NULL),
(44, 'Electronics', 'Consumer and industrial electronic products', NULL, NULL),
(45, 'Hardware & Networking', 'Computer hardware, peripherals, and network services', NULL, NULL),
(46, 'Marine', 'Shipping, ports, and marine services', NULL, NULL),
(47, 'Media & Advertising', 'Marketing, PR, and digital advertising agencies', NULL, NULL),
(48, 'Sports & Fitness', 'Gyms, sports clubs, and fitness products', NULL, NULL),
(49, 'Waste Management', 'Recycling and waste disposal services', NULL, NULL),
(50, 'Other', 'Industries not categorized above', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_11_07_011325_create_businesses_table', 1),
(5, '2025_11_07_011336_create_categories_table', 1),
(6, '2025_11_07_011405_create_brands_table', 1),
(7, '2025_11_07_011413_create_units_table', 1),
(8, '2025_11_07_011420_create_products_table', 1),
(9, '2025_11_07_011428_create_customers_table', 1),
(10, '2025_11_07_011436_create_suppliers_table', 1),
(11, '2025_11_07_011443_create_expense_categories_table', 1),
(12, '2025_11_07_011449_create_expenses_table', 1),
(13, '2025_11_07_011457_create_orders_table', 1),
(14, '2025_11_07_011505_create_order_items_table', 1),
(15, '2025_11_07_011511_create_purchases_table', 1),
(16, '2025_11_07_011519_create_purchase_items_table', 1),
(17, '2025_11_07_011531_create_payments_table', 1),
(18, '2025_11_07_011538_create_estimates_table', 1),
(19, '2025_11_07_011546_create_estimate_items_table', 1),
(20, '2025_11_07_011554_create_roles_table', 1),
(21, '2025_11_07_011601_create_permissions_table', 1),
(22, '2025_11_07_011607_create_role_permissions_table', 1),
(23, '2025_11_07_011614_create_user_roles_table', 1),
(24, '2025_11_07_013050_create_personal_access_tokens_table', 1),
(25, '2025_11_07_063435_create_user_businesses_table', 2),
(26, '2025_11_07_225703_add_as_of_and_low_stock_columns_to_products_table', 3),
(28, '2025_11_08_232627_add_missing_fields_to_customers_table', 4),
(33, '2025_11_09_143522_create_industry_types', 5),
(34, '2025_11_10_031925_add_gst_and_invoice_fields_to_businesses_table', 6),
(35, '2025_11_12_084048_create_states_table', 7);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `invoice_number` varchar(255) DEFAULT NULL,
  `reference_number` varchar(255) DEFAULT NULL,
  `order_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `order_type` enum('sale','purchase','estimate','quotation') NOT NULL,
  `status` enum('draft','pending','confirmed','shipped','delivered','cancelled','returned','refunded') NOT NULL,
  `payment_status` enum('pending','partial','paid','overdue','refunded') NOT NULL,
  `payment_method` enum('cash','card','upi','bank_transfer','cheque','credit') NOT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `shipping_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `round_off` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paid_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `balance_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `exchange_rate` decimal(10,4) NOT NULL DEFAULT 1.0000,
  `currency` varchar(255) NOT NULL DEFAULT 'INR',
  `taxable_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cgst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sgst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `igst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cess_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `notes` varchar(255) DEFAULT NULL,
  `terms_and_conditions` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `billing_address` varchar(255) DEFAULT NULL,
  `shipped_date` date DEFAULT NULL,
  `delivered_date` date DEFAULT NULL,
  `paid_date` date DEFAULT NULL,
  `tracking_number` varchar(255) DEFAULT NULL,
  `ewaybill_number` varchar(255) DEFAULT NULL,
  `is_recurring` tinyint(1) NOT NULL DEFAULT 0,
  `recurring_frequency` varchar(255) DEFAULT NULL,
  `recurring_until` date DEFAULT NULL,
  `is_draft` tinyint(1) NOT NULL DEFAULT 0,
  `is_cancelled` tinyint(1) NOT NULL DEFAULT 0,
  `cancelled_date` date DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `custom_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_fields`)),
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `supplier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `invoice_number`, `reference_number`, `order_date`, `due_date`, `order_type`, `status`, `payment_status`, `payment_method`, `subtotal`, `tax_amount`, `discount_amount`, `shipping_amount`, `round_off`, `total_amount`, `paid_amount`, `balance_amount`, `exchange_rate`, `currency`, `taxable_amount`, `cgst_amount`, `sgst_amount`, `igst_amount`, `cess_amount`, `notes`, `terms_and_conditions`, `shipping_address`, `billing_address`, `shipped_date`, `delivered_date`, `paid_date`, `tracking_number`, `ewaybill_number`, `is_recurring`, `recurring_frequency`, `recurring_until`, `is_draft`, `is_cancelled`, `cancelled_date`, `cancellation_reason`, `custom_fields`, `business_id`, `customer_id`, `supplier_id`, `created_by`, `created_at`, `updated_at`) VALUES
(5, 'ORD-20251108-QFSMJ', 'INV-20251108-2UJXD', NULL, '2025-11-08', '2025-11-08', 'sale', 'confirmed', 'pending', 'cash', 5000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1.0000, 'INR', 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, 0, NULL, NULL, NULL, 3, NULL, NULL, 8, '2025-11-07 19:44:03', '2025-11-07 19:44:03'),
(6, 'ORD-20251108-OA6DH', 'INV-20251108-COKZ1', NULL, '2025-11-08', '2025-11-08', 'sale', 'confirmed', 'paid', 'cash', 5000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1.0000, 'INR', 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, 0, NULL, NULL, NULL, 3, NULL, NULL, 8, '2025-11-07 19:45:02', '2025-11-07 19:45:02'),
(7, 'ORD-20251108-KSWCY', 'INV-20251108-VMQPJ', NULL, '2025-11-08', NULL, 'sale', 'confirmed', 'paid', 'cash', 5000.00, 0.00, 0.00, 0.00, 0.00, 53999.00, 0.00, 0.00, 1.0000, 'INR', 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, 0, NULL, NULL, NULL, 3, NULL, NULL, 8, '2025-11-07 20:18:33', '2025-11-07 20:18:33'),
(9, 'ORD-20251108-HWNFY', 'INV-20251108-ROO2Y', NULL, '2025-11-08', NULL, 'sale', 'confirmed', 'paid', 'cash', 5000.00, 0.00, 0.00, 0.00, 0.00, 53999.00, 0.00, 0.00, 1.0000, 'INR', 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, 0, NULL, NULL, NULL, 3, NULL, NULL, 8, '2025-11-07 20:22:43', '2025-11-07 20:22:43'),
(10, 'ORD-20251108-FFALS', 'INV-20251108-68JFT', NULL, '2025-11-08', NULL, 'sale', 'confirmed', 'paid', 'cash', 5000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1.0000, 'INR', 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, 0, NULL, NULL, NULL, 3, NULL, NULL, 8, '2025-11-07 20:25:27', '2025-11-07 20:25:27'),
(11, 'ORD-20251108-Z5AL9', 'INV-20251108-CMCYX', NULL, '2025-11-08', NULL, 'sale', 'confirmed', 'paid', 'cash', 20000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1.0000, 'INR', 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, 0, NULL, NULL, NULL, 3, NULL, NULL, 8, '2025-11-07 20:26:10', '2025-11-07 20:26:10'),
(12, 'ORD-20251108-ZYGXY', 'INV-20251108-ZHW9U', NULL, '2025-11-08', NULL, 'sale', 'confirmed', 'paid', 'cash', 53999.00, 0.00, 0.00, 0.00, 0.00, 53999.00, 0.00, 0.00, 1.0000, 'INR', 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, 0, NULL, NULL, NULL, 3, NULL, NULL, 8, '2025-11-07 21:14:31', '2025-11-07 21:14:31'),
(13, 'ORD-20251109-GJUSD', 'INV-20251109-8YH9L', NULL, '2025-11-09', NULL, 'sale', 'confirmed', 'paid', 'cash', 7669.15, 0.00, 0.00, 0.00, 0.00, 7669.15, 0.00, 0.00, 1.0000, 'INR', 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, 0, NULL, NULL, NULL, 3, NULL, NULL, 8, '2025-11-09 07:27:54', '2025-11-09 07:27:54');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `item_type` varchar(255) NOT NULL DEFAULT 'product',
  `name` varchar(255) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity` decimal(10,3) NOT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `taxable_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `cgst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sgst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `igst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cess_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cgst_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `sgst_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `igst_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `cess_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `hsn_code` varchar(255) DEFAULT NULL,
  `tax_type` varchar(255) NOT NULL DEFAULT 'gst',
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attributes`)),
  `return_quantity` int(11) NOT NULL DEFAULT 0,
  `return_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `item_type`, `name`, `sku`, `description`, `quantity`, `unit`, `unit_price`, `discount_amount`, `discount_percent`, `tax_amount`, `taxable_amount`, `subtotal`, `total`, `cgst_amount`, `sgst_amount`, `igst_amount`, `cess_amount`, `cgst_rate`, `sgst_rate`, `igst_rate`, `cess_rate`, `hsn_code`, `tax_type`, `attributes`, `return_quantity`, `return_amount`, `order_id`, `product_id`, `created_at`, `updated_at`) VALUES
(1, 'product', 'Maggie', '-', NULL, 1.000, 'PCS', 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 5000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 'gst', NULL, 0, 0.00, 5, NULL, '2025-11-07 19:44:03', '2025-11-07 19:44:03'),
(2, 'product', 'Maggie', '-', NULL, 1.000, 'PCS', 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 5000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 'gst', NULL, 0, 0.00, 6, NULL, '2025-11-07 19:45:02', '2025-11-07 19:45:02'),
(3, 'product', 'Maggie', '-', NULL, 1.000, 'PCS', 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 5000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 'gst', NULL, 0, 0.00, 7, NULL, '2025-11-07 20:18:33', '2025-11-07 20:18:33'),
(4, 'product', 'Maggie', 'EGVS2IAX', NULL, 1.000, 'PCS', 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 5000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 'gst', NULL, 0, 0.00, 9, NULL, '2025-11-07 20:22:43', '2025-11-07 20:22:43'),
(5, 'product', 'Maggie', 'EGVS2IAX', NULL, 1.000, 'PCS', 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 5000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 'gst', NULL, 0, 0.00, 10, 6, '2025-11-07 20:25:27', '2025-11-07 20:25:27'),
(6, 'product', 'Maggie', 'EGVS2IAX', NULL, 4.000, 'PCS', 5000.00, 0.00, 0.00, 0.00, 0.00, 20000.00, 20000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 'gst', NULL, 0, 0.00, 11, 6, '2025-11-07 20:26:10', '2025-11-07 20:26:10'),
(7, 'product', 'Maggie', 'EGVS2IAX', NULL, 1.000, 'PCS', 5000.00, 0.00, 0.00, 0.00, 0.00, 5000.00, 5000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 'gst', NULL, 0, 0.00, 12, 6, '2025-11-07 21:14:31', '2025-11-07 21:14:31'),
(8, 'product', 'Samsung 55\" Smart LED TV', 'SAMTV-55', NULL, 1.000, 'PCS', 48999.00, 0.00, 0.00, 0.00, 0.00, 48999.00, 48999.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 'gst', NULL, 0, 0.00, 12, 2, '2025-11-07 21:14:31', '2025-11-07 21:14:31'),
(9, 'product', 'Sit assumenda', 'SKU-58736', NULL, 1.000, 'PCS', 3766.18, 0.00, 0.00, 0.00, 0.00, 3766.18, 3766.18, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 'gst', NULL, 0, 0.00, 13, 90, '2025-11-09 07:27:54', '2025-11-09 07:27:54'),
(10, 'product', 'Magni itaque', 'SKU-05430', NULL, 1.000, 'PCS', 3902.97, 0.00, 0.00, 0.00, 0.00, 3902.97, 3902.97, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 'gst', NULL, 0, 0.00, 13, 95, '2025-11-09 07:27:54', '2025-11-09 07:27:54');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payment_number` varchar(255) NOT NULL,
  `payment_type` enum('sale','purchase','expense','income','refund') NOT NULL,
  `payment_method` enum('cash','card','upi','bank_transfer','cheque','wallet','other') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `reference_number` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `ifsc_code` varchar(255) DEFAULT NULL,
  `card_last_four` varchar(255) DEFAULT NULL,
  `upi_id` varchar(255) DEFAULT NULL,
  `wallet_provider` varchar(255) DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_refund` tinyint(1) NOT NULL DEFAULT 0,
  `refund_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `refund_date` date DEFAULT NULL,
  `refund_reason` varchar(255) DEFAULT NULL,
  `is_cancelled` tinyint(1) NOT NULL DEFAULT 0,
  `cancelled_date` date DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `custom_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_fields`)),
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `purchase_id` bigint(20) UNSIGNED DEFAULT NULL,
  `expense_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `supplier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `received_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `group` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(19, 'App\\Models\\User', 8, 'auth_token', '393950397a6f07c83429af31e95f7a1dfad360f06558e7320d91432ec18c7daa', '[\"*\"]', '2025-11-12 03:20:07', NULL, '2025-11-10 23:34:24', '2025-11-12 03:20:07'),
(20, 'App\\Models\\User', 9, 'auth_token', '44d5e72ecaea11dcefa7a761c620a578c8581d85bd7c721b5474f8744720c9cd', '[\"*\"]', '2025-11-11 03:18:22', NULL, '2025-11-11 03:18:17', '2025-11-11 03:18:22'),
(21, 'App\\Models\\User', 8, 'auth_token', '7737fdeb4836ef9cc97190c7d366791a6d907040f7370372f53f12a84aa4aa54', '[\"*\"]', '2025-11-13 05:11:18', NULL, '2025-11-13 05:11:08', '2025-11-13 05:11:18');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `hsn_code` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `purchase_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sale_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `wholesale_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `mrp` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `as_of_date` date DEFAULT NULL,
  `min_stock_level` int(11) NOT NULL DEFAULT 5,
  `low_stock_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `max_stock_level` int(11) DEFAULT NULL,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `tax_type` varchar(255) NOT NULL DEFAULT 'gst',
  `discount_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
  `discount_type` varchar(255) NOT NULL DEFAULT 'percentage',
  `track_inventory` tinyint(1) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `gallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gallery`)),
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attributes`)),
  `weight` varchar(255) DEFAULT NULL,
  `dimensions` varchar(255) DEFAULT NULL,
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `brand_id` bigint(20) UNSIGNED DEFAULT NULL,
  `unit_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `sku`, `barcode`, `hsn_code`, `description`, `purchase_price`, `sale_price`, `wholesale_price`, `mrp`, `stock_quantity`, `as_of_date`, `min_stock_level`, `low_stock_enabled`, `max_stock_level`, `tax_rate`, `tax_type`, `discount_percent`, `discount_type`, `track_inventory`, `is_active`, `is_featured`, `image`, `gallery`, `attributes`, `weight`, `dimensions`, `business_id`, `category_id`, `brand_id`, `unit_id`, `created_at`, `updated_at`) VALUES
(1, 'Apple iPhone 15', 'IPH15-001', 'zmUnfSk5Ho', '85171200', 'Apple iPhone 15 (128GB, Blue) – A16 Bionic chip with advanced dual camera system.', 68000.00, 74999.00, 72000.00, 79999.00, 25, NULL, 5, 0, 100, 18.00, 'gst', 5.00, 'percentage', 1, 1, 1, 'products/iphone15.jpg', '[\"products\\/iphone15-1.jpg\",\"products\\/iphone15-2.jpg\"]', '\"{\\\"color\\\":\\\"Blue\\\",\\\"storage\\\":\\\"128GB\\\"}\"', '200g', '\"147.6 x 71.6 x 7.8 mm\"', 3, 7, NULL, NULL, '2025-11-07 10:28:44', '2025-11-07 10:29:34'),
(2, 'Samsung 55\" Smart LED TV', 'SAMTV-55', 'pkfS6JMLAL', '85287217', 'Samsung 55-inch 4K UHD Smart LED TV with HDR10+ and built-in Alexa.', 42000.00, 48999.00, 45000.00, 52000.00, 14, NULL, 3, 0, 50, 18.00, 'gst', 10.00, 'fixed', 1, 1, 1, 'products/samsung55.jpg', '[\"products\\/samsung55-1.jpg\"]', '\"{\\\"screen_size\\\":\\\"55 inch\\\",\\\"resolution\\\":\\\"4K UHD\\\"}\"', '12 kg', '\"1230 x 710 x 60 mm\"', 3, 7, NULL, NULL, '2025-11-07 10:29:34', '2025-11-07 21:14:31'),
(3, 'HP Pavilion 15 Laptop', 'HPLAP15', 'vBiElG0OC8', '84713010', 'HP Pavilion 15 – Intel i5 13th Gen, 16GB RAM, 512GB SSD, Windows 11.', 55000.00, 63999.00, 61000.00, 65999.00, 12, NULL, 3, 0, 40, 18.00, 'gst', 5.00, 'percentage', 1, 1, 0, 'products/hp-pavilion15.jpg', '[]', '\"{\\\"processor\\\":\\\"Intel i5 13th Gen\\\",\\\"ram\\\":\\\"16GB\\\",\\\"storage\\\":\\\"512GB SSD\\\"}\"', '1.7 kg', '\"360 x 240 x 19 mm\"', 3, 7, NULL, NULL, '2025-11-07 10:29:34', '2025-11-07 10:29:34'),
(4, 'Sony WH-1000XM5 Headphones', 'SONYWHXM5', 'wRXiMauhkH', '85183000', 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones with 30-hour battery life.', 23000.00, 26990.00, 25000.00, 27990.00, 30, NULL, 30, 1, 80, 18.00, 'gst', 10.00, 'percentage', 1, 1, 1, 'products/sonywh1000xm5.jpg', '[\"products\\/sonywh1000xm5-1.jpg\"]', '\"{\\\"color\\\":\\\"Black\\\"}\"', '250g', '\"200 x 185 x 80 mm\"', 3, 7, NULL, NULL, '2025-11-07 10:29:34', '2025-11-07 10:29:34'),
(6, 'Maggie', 'EGVS2IAX', '268602959514', NULL, NULL, 0.00, 5000.00, 0.00, 0.00, 5, NULL, 5, 1, NULL, 0.00, 'gst', 0.00, 'percentage', 1, 1, 0, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, '2025-11-07 17:14:12', '2025-11-07 21:14:31'),
(7, 'Atta', '3ALT46EG', '883927289920', '123', 'safsafsafsdaf', 0.00, 15000.00, 0.00, 0.00, 0, NULL, 5, 0, NULL, 0.00, 'gst', 0.00, 'percentage', 1, 1, 0, NULL, NULL, NULL, NULL, NULL, 3, 5, NULL, NULL, '2025-11-07 17:19:01', '2025-11-07 17:19:01'),
(9, 'Atta2', '323233232', '323233232', NULL, 'sdafsdafs', 0.00, 5000.00, 0.00, 0.00, 500, '2025-11-07', 5, 1, NULL, 0.25, 'gst', 0.00, 'percentage', 1, 1, 0, NULL, NULL, NULL, NULL, NULL, 3, 4, NULL, 2, '2025-11-07 17:41:16', '2025-11-07 17:41:16'),
(10, 'sdafsdafsaf', 'SMMVBWHA', '733332689712', NULL, NULL, 0.00, 0.00, 0.00, 0.00, 0, '2025-11-08', 5, 0, NULL, 0.00, 'gst', 0.00, 'percentage', 1, 1, 0, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, 6, '2025-11-07 23:57:41', '2025-11-07 23:57:41'),
(11, 'What is this', 'ZVTQ2ERC', '457004044908', NULL, NULL, 0.00, 0.00, 0.00, 0.00, 0, '2025-11-08', 5, 0, NULL, 0.00, 'gst', 0.00, 'percentage', 1, 1, 0, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, 6, '2025-11-07 23:57:56', '2025-11-07 23:57:56'),
(14, 'Ut qui', 'SKU-15390', 'BAR-6277367792', '182833', 'Ipsum mollitia perspiciatis id nihil quis aut ab.', 4277.38, 4838.70, 4734.40, 5298.73, 449, NULL, 7, 0, 346, 12.00, 'igst', 1.07, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"fuchsia\"}', '3.11 kg', '30x20x15 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(15, 'Reiciendis suscipit', 'SKU-14669', 'BAR-4045092650', '350068', 'Consequuntur nulla qui maiores nesciunt veniam officia rerum.', 1728.74, 1805.99, 1647.83, 1877.36, 240, NULL, 6, 0, 466, 5.00, 'gst', 7.93, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"olive\"}', '2.35 kg', '20x15x10 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(16, 'Distinctio magnam', 'SKU-48751', 'BAR-9007474149', '847467', 'Praesentium odio rem exercitationem repellendus provident est natus quidem pariatur sint perspiciatis eos.', 386.96, 981.29, 957.87, 1075.55, 222, NULL, 4, 0, 326, 0.00, 'none', 3.67, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"olive\"}', '0.12 kg', '30x20x15 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(17, 'Et quo', 'SKU-08666', 'BAR-3168656796', '581622', 'Debitis ipsa id soluta quia at illum aut molestiae qui laborum.', 1794.11, 2143.67, 1977.50, 2241.64, 126, NULL, 9, 0, 111, 5.00, 'igst', 6.62, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"navy\"}', '0.57 kg', '30x20x15 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(18, 'Dolores id', 'SKU-00792', 'BAR-3729122550', '596741', 'Rerum temporibus dolorum est perferendis praesentium quasi sit et exercitationem qui perferendis sed doloribus.', 485.46, 967.64, 832.92, 1094.46, 390, NULL, 4, 0, 122, 12.00, 'gst', 4.94, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"fuchsia\"}', '1.34 kg', '10x10x5 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(19, 'Iste nemo', 'SKU-22184', 'BAR-5881085830', '141668', 'Perspiciatis id ut ipsam optio recusandae eligendi officiis odit.', 496.52, 1100.34, 954.94, 1426.84, 144, NULL, 6, 0, 331, 28.00, 'gst', 8.69, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"olive\"}', '4.62 kg', '20x15x10 cm', 3, 7, NULL, 2, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(20, 'Voluptatem rem', 'SKU-02115', 'BAR-2456627544', '246937', 'Esse nesciunt maxime est quia est quisquam commodi qui.', 2997.53, 3827.11, 3734.83, 3907.18, 72, NULL, 2, 0, 319, 18.00, 'igst', 10.79, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"maroon\"}', '4 kg', '10x10x5 cm', 3, 7, NULL, 1, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(21, 'Quaerat rerum', 'SKU-91938', 'BAR-7299325166', '682532', 'Itaque amet eum nostrum ut doloribus eaque dolor.', 2315.70, 2839.02, 2828.06, 3329.85, 421, NULL, 7, 0, 70, 5.00, 'none', 3.95, 'percentage', 1, 1, 1, NULL, '[]', '{\"size\":\"M\",\"color\":\"teal\"}', '3.28 kg', '30x20x15 cm', 3, 7, NULL, 3, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(22, 'Eaque quia', 'SKU-80951', 'BAR-9370776476', '903873', 'Aut accusantium incidunt quisquam consectetur non consequuntur optio cum est.', 3731.54, 3834.46, 3706.46, 3944.65, 197, NULL, 4, 0, 131, 0.00, 'gst', 9.14, 'percentage', 1, 1, 1, NULL, '[]', '{\"size\":\"M\",\"color\":\"yellow\"}', '4.01 kg', '30x20x15 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(23, 'Dignissimos veritatis', 'SKU-68480', 'BAR-5146407711', '553629', 'Sit ad modi vero est quam odit nesciunt sed.', 3087.66, 3104.53, 2958.64, 3545.67, 312, NULL, 4, 0, 310, 28.00, 'igst', 13.88, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"navy\"}', '1.98 kg', '10x10x5 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(24, 'Ad culpa', 'SKU-39028', 'BAR-6048796257', '551286', 'Earum voluptatem error iste totam non voluptatem sunt minus.', 1820.02, 1914.35, 1871.93, 2278.41, 64, NULL, 2, 0, 224, 12.00, 'gst', 0.13, 'percentage', 1, 1, 1, NULL, '[]', '{\"size\":\"L\",\"color\":\"silver\"}', '2.62 kg', '10x10x5 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(25, 'Voluptatem fugit', 'SKU-15706', 'BAR-8154576820', '658873', 'Et error beatae qui quia doloremque dolore aut deleniti magni.', 4457.95, 5371.27, 5186.61, 5786.03, 307, NULL, 8, 0, 55, 12.00, 'gst', 14.26, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"aqua\"}', '2.12 kg', '20x15x10 cm', 3, 7, NULL, 3, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(26, 'Ipsum aperiam', 'SKU-01863', 'BAR-5859863039', '705283', 'Neque minus et eos officiis est ea incidunt eos qui aspernatur omnis quidem et.', 2317.55, 2862.31, 2676.59, 3261.94, 53, NULL, 4, 0, 428, 12.00, 'none', 14.50, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"blue\"}', '2.86 kg', '10x10x5 cm', 3, 7, NULL, 2, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(27, 'Nobis quod', 'SKU-13603', 'BAR-7579634124', '106909', 'Similique eveniet quod dolorum ut est aspernatur omnis.', 1666.51, 1874.06, 1719.72, 2344.21, 250, NULL, 7, 0, 108, 5.00, 'none', 6.99, 'percentage', 1, 1, 1, NULL, '[]', '{\"size\":\"L\",\"color\":\"navy\"}', '2.92 kg', '10x10x5 cm', 3, 7, NULL, 1, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(28, 'Voluptatem autem', 'SKU-41195', 'BAR-6143959844', '442401', 'Nulla omnis dolorem est debitis ex occaecati maiores natus.', 4618.60, 4702.98, 4583.75, 5121.32, 335, NULL, 8, 0, 394, 18.00, 'none', 12.30, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"gray\"}', '4.87 kg', '10x10x5 cm', 3, 7, NULL, 2, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(29, 'Quidem minima', 'SKU-90778', 'BAR-3352423288', '487544', 'Velit fuga totam aut amet cumque qui et tempora laudantium quod.', 1051.24, 1368.88, 1196.01, 1458.01, 455, NULL, 9, 0, 406, 5.00, 'none', 14.69, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"green\"}', '3.37 kg', '20x15x10 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(30, 'Consectetur officia', 'SKU-11732', 'BAR-4867740209', '482920', 'Et aut quas iste unde similique eaque labore quia.', 3406.92, 3722.65, 3658.57, 3994.81, 211, NULL, 8, 0, 126, 28.00, 'none', 7.14, 'percentage', 1, 1, 1, NULL, '[]', '{\"size\":\"M\",\"color\":\"lime\"}', '2.62 kg', '10x10x5 cm', 3, 7, NULL, 2, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(31, 'Est sit', 'SKU-97776', 'BAR-1425208008', '999873', 'Et voluptas voluptas dolorem et reprehenderit doloremque numquam dolor.', 3857.97, 4836.49, 4761.42, 5099.47, 287, NULL, 10, 0, 466, 28.00, 'igst', 1.60, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"purple\"}', '0.4 kg', '10x10x5 cm', 3, 7, NULL, 3, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(32, 'Cum iste', 'SKU-43252', 'BAR-0195963069', '323507', 'Eum dolorem ut aliquid ut dolorem sit dolorum saepe.', 647.01, 737.86, 645.33, 920.74, 254, NULL, 7, 0, 169, 12.00, 'gst', 7.57, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"white\"}', '0.99 kg', '10x10x5 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(33, 'Debitis debitis', 'SKU-05491', 'BAR-9730919815', '636747', 'Neque qui provident omnis sunt recusandae nesciunt ipsum sequi mollitia nobis aut eaque.', 3190.58, 4041.23, 4022.84, 4504.34, 100, NULL, 6, 0, 310, 12.00, 'gst', 5.14, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"maroon\"}', '2.54 kg', '30x20x15 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(34, 'Modi ut', 'SKU-55782', 'BAR-0539056486', '578714', 'Et velit at veniam sint aut aliquam vitae.', 3302.23, 4103.22, 3981.16, 4151.68, 489, NULL, 4, 0, 422, 28.00, 'gst', 5.40, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"olive\"}', '3.92 kg', '30x20x15 cm', 3, 7, NULL, 1, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(35, 'Et illum', 'SKU-04637', 'BAR-4786039391', '505309', 'Commodi laudantium non eveniet dolorem dolores nostrum vero reiciendis nulla.', 1654.52, 1741.65, 1569.85, 1766.74, 159, NULL, 9, 0, 221, 5.00, 'gst', 3.97, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"aqua\"}', '0.41 kg', '10x10x5 cm', 3, 7, NULL, 3, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(36, 'Culpa magnam', 'SKU-46180', 'BAR-0666998240', '267017', 'Et voluptatum vitae aut maiores inventore quis debitis unde exercitationem.', 3702.70, 4529.67, 4382.36, 4561.38, 39, NULL, 10, 0, 475, 18.00, 'none', 8.44, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"purple\"}', '2.99 kg', '20x15x10 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(37, 'Accusamus et', 'SKU-14602', 'BAR-6632144170', '692241', 'Neque voluptatem cum accusamus voluptatem nihil maxime labore.', 3363.46, 3754.83, 3557.52, 4136.70, 451, NULL, 3, 0, 171, 18.00, 'none', 0.02, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"silver\"}', '4.77 kg', '20x15x10 cm', 3, 7, NULL, 3, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(38, 'Soluta consequatur', 'SKU-23552', 'BAR-1523330563', '891313', 'Nostrum consectetur nobis modi beatae nesciunt et omnis commodi et quaerat beatae omnis sapiente perferendis.', 3275.90, 3629.07, 3515.36, 4051.26, 282, NULL, 9, 0, 51, 0.00, 'gst', 8.34, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"yellow\"}', '4.77 kg', '30x20x15 cm', 3, 7, NULL, 3, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(39, 'Aperiam repudiandae', 'SKU-61658', 'BAR-0731781064', '745896', 'Aperiam doloremque enim eaque delectus officiis ut id et doloremque quasi sed eligendi.', 1702.16, 1744.06, 1630.25, 2059.88, 88, NULL, 8, 0, 60, 28.00, 'igst', 8.52, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"silver\"}', '2.61 kg', '30x20x15 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(40, 'Minus ipsa', 'SKU-38462', 'BAR-3831756672', '034387', 'Consectetur sit alias officiis aut impedit repellat voluptatum sit.', 3445.27, 3770.49, 3738.51, 3797.83, 288, NULL, 3, 0, 389, 18.00, 'gst', 11.50, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"black\"}', '2.27 kg', '30x20x15 cm', 3, 7, NULL, 3, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(41, 'Unde similique', 'SKU-90951', 'BAR-9445468898', '840919', 'Enim odit eos earum magnam recusandae tempora accusantium eaque reiciendis quae vitae aperiam.', 3809.98, 3870.43, 3820.05, 4190.96, 284, NULL, 9, 0, 300, 18.00, 'gst', 9.09, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"green\"}', '1.73 kg', '20x15x10 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(42, 'Perspiciatis aliquam', 'SKU-36593', 'BAR-0947707148', '528568', 'Voluptatem corrupti excepturi vel quaerat molestias ea.', 694.65, 885.89, 739.50, 1268.76, 162, NULL, 2, 0, 348, 12.00, 'gst', 1.51, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"silver\"}', '4.52 kg', '30x20x15 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(43, 'Et ex', 'SKU-38347', 'BAR-9632652258', '663167', 'Commodi corporis odit sit esse possimus quaerat cumque molestiae voluptatem.', 1977.02, 2551.39, 2376.36, 2845.85, 331, NULL, 7, 0, 176, 28.00, 'igst', 11.72, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"aqua\"}', '4.25 kg', '30x20x15 cm', 3, 7, NULL, 1, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(44, 'Consectetur quis', 'SKU-42193', 'BAR-0225433109', '422021', 'Dicta odio odit magnam et quas perferendis.', 3553.96, 3877.43, 3803.22, 4267.31, 311, NULL, 7, 0, 408, 5.00, 'igst', 14.50, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"silver\"}', '1.49 kg', '10x10x5 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(45, 'Ab quae', 'SKU-80110', 'BAR-2000729038', '571910', 'Reprehenderit aut sit eos possimus sapiente molestias consequatur labore officia dicta velit maiores.', 3107.44, 3840.11, 3714.94, 3958.78, 290, NULL, 5, 0, 260, 18.00, 'igst', 0.91, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"green\"}', '3.5 kg', '30x20x15 cm', 3, 7, NULL, 2, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(46, 'Autem laborum', 'SKU-29645', 'BAR-6444894583', '441842', 'Et magnam dolorem repellat officiis sed sed alias.', 3795.23, 4393.34, 4209.83, 4485.15, 204, NULL, 8, 0, 410, 12.00, 'none', 10.56, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"aqua\"}', '1.3 kg', '10x10x5 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(47, 'In qui', 'SKU-89498', 'BAR-7459906080', '806016', 'Ratione earum earum quibusdam nam dolorum nisi sed laborum cum.', 2716.95, 3394.96, 3373.85, 3520.58, 463, NULL, 3, 0, 422, 12.00, 'none', 15.00, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"lime\"}', '0.41 kg', '10x10x5 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(48, 'Accusantium dolorum', 'SKU-66238', 'BAR-5059676299', '463530', 'Ut tempore unde qui odit sint dicta ipsa.', 4532.69, 4899.19, 4726.12, 5368.72, 317, NULL, 5, 0, 244, 18.00, 'igst', 13.21, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"teal\"}', '4.9 kg', '20x15x10 cm', 3, 7, NULL, 1, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(49, 'Placeat ab', 'SKU-76054', 'BAR-6363311292', '998668', 'Distinctio voluptas dolorum autem fuga ab et.', 3582.36, 4159.81, 4019.30, 4174.81, 308, NULL, 2, 0, 187, 12.00, 'gst', 2.02, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"silver\"}', '2.7 kg', '30x20x15 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(50, 'Eos explicabo', 'SKU-11636', 'BAR-3449435653', '805031', 'Quo eveniet consectetur assumenda voluptatem maxime aut.', 2440.73, 3267.97, 3068.46, 3458.85, 332, NULL, 5, 0, 167, 0.00, 'none', 6.55, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"white\"}', '2.72 kg', '20x15x10 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(51, 'Velit non', 'SKU-17264', 'BAR-2398930152', '701118', 'Distinctio qui repellat id libero veniam et necessitatibus at ut dolore id inventore.', 1031.14, 1340.61, 1247.08, 1419.85, 490, NULL, 2, 0, 398, 28.00, 'igst', 0.18, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"yellow\"}', '1.33 kg', '10x10x5 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(52, 'Et rerum', 'SKU-47676', 'BAR-9634999334', '035711', 'Et ut cupiditate ratione commodi nobis dolores.', 1447.14, 1556.92, 1407.87, 1775.86, 76, NULL, 3, 0, 371, 28.00, 'none', 10.66, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"lime\"}', '2.26 kg', '30x20x15 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(53, 'Totam explicabo', 'SKU-64564', 'BAR-5306167379', '582823', 'Quis voluptates facere dolore aperiam nemo fugit eius laborum qui omnis nostrum.', 1997.90, 2781.52, 2600.16, 3090.50, 184, NULL, 3, 0, 479, 5.00, 'gst', 13.83, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"green\"}', '0.42 kg', '30x20x15 cm', 3, 7, NULL, 1, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(54, 'Culpa non', 'SKU-51453', 'BAR-9430695853', '653974', 'Optio ea omnis ut odio eos et sequi voluptas facere voluptas in rem et.', 1627.92, 2458.60, 2434.26, 2894.09, 192, NULL, 2, 0, 391, 0.00, 'igst', 7.41, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"maroon\"}', '4.52 kg', '30x20x15 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(55, 'Sit veniam', 'SKU-82689', 'BAR-2165598536', '932482', 'Atque qui qui fuga ut nihil beatae explicabo.', 1324.34, 1937.60, 1848.14, 2152.67, 344, NULL, 7, 0, 69, 12.00, 'igst', 2.59, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"gray\"}', '3.13 kg', '30x20x15 cm', 3, 7, NULL, 1, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(56, 'Qui voluptatum', 'SKU-19261', 'BAR-6778280770', '000448', 'Non quos est nobis commodi et dolores rerum.', 4509.60, 5115.16, 4994.14, 5237.39, 389, NULL, 2, 0, 290, 18.00, 'gst', 9.67, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"black\"}', '1.31 kg', '20x15x10 cm', 3, 7, NULL, 2, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(57, 'Optio dignissimos', 'SKU-67985', 'BAR-3004224686', '501937', 'Sit qui fuga perspiciatis quia occaecati aperiam et laborum non rerum voluptatem voluptatem quia.', 267.63, 1000.55, 975.44, 1076.95, 42, NULL, 8, 0, 181, 5.00, 'none', 2.71, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"yellow\"}', '0.33 kg', '30x20x15 cm', 3, 7, NULL, 2, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(58, 'Facilis omnis', 'SKU-97462', 'BAR-1367455889', '675628', 'Ducimus facere omnis numquam voluptas ad deserunt aut beatae a.', 4029.29, 4773.39, 4683.75, 5048.03, 340, NULL, 6, 0, 156, 5.00, 'gst', 12.49, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"purple\"}', '4.77 kg', '10x10x5 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(59, 'Qui molestiae', 'SKU-12208', 'BAR-1139427844', '615736', 'Maiores voluptatem expedita pariatur vitae quia voluptates dolor qui qui aut.', 2776.92, 3294.74, 3272.77, 3429.49, 333, NULL, 10, 0, 461, 12.00, 'igst', 10.58, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"black\"}', '1.89 kg', '30x20x15 cm', 3, 7, NULL, 3, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(60, 'Voluptate rerum', 'SKU-10429', 'BAR-5223449512', '475637', 'Dolore quasi reprehenderit hic eos iure nam omnis velit dignissimos maiores.', 2440.38, 2832.46, 2681.13, 3271.71, 195, NULL, 8, 0, 180, 28.00, 'none', 0.05, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"gray\"}', '3.25 kg', '10x10x5 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(61, 'Ullam ea', 'SKU-66758', 'BAR-1401323334', '666438', 'Repellat quisquam soluta debitis exercitationem nemo molestiae et maxime dolores aut.', 2999.23, 3473.24, 3370.32, 3886.90, 457, NULL, 10, 0, 85, 28.00, 'none', 11.74, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"olive\"}', '1.83 kg', '20x15x10 cm', 3, 7, NULL, 3, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(62, 'Nobis voluptas', 'SKU-80533', 'BAR-4175447913', '346750', 'Eum nostrum nobis alias dicta cupiditate et hic accusantium nesciunt et commodi.', 1686.07, 2470.74, 2287.81, 2674.19, 350, NULL, 10, 0, 383, 0.00, 'none', 14.41, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"aqua\"}', '3.84 kg', '20x15x10 cm', 3, 7, NULL, 1, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(63, 'Molestiae nulla', 'SKU-34641', 'BAR-8062396169', '435878', 'Omnis voluptas facere eveniet sed velit libero consectetur at omnis.', 339.46, 909.89, 715.52, 976.90, 359, NULL, 2, 0, 475, 5.00, 'igst', 0.88, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"black\"}', '4.1 kg', '20x15x10 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(64, 'Rem neque', 'SKU-01492', 'BAR-3845056900', '064611', 'Quam consequatur ratione nesciunt qui cupiditate pariatur aut laudantium excepturi.', 3439.38, 4137.03, 3984.98, 4496.74, 205, NULL, 8, 0, 101, 12.00, 'none', 14.86, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"lime\"}', '3.24 kg', '10x10x5 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(65, 'Quos et', 'SKU-89209', 'BAR-2184748776', '633941', 'Quos enim est pariatur est libero ea.', 1049.30, 1944.11, 1848.11, 2342.92, 113, NULL, 5, 0, 334, 5.00, 'igst', 12.75, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"black\"}', '4.66 kg', '10x10x5 cm', 3, 7, NULL, 2, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(66, 'Illo accusamus', 'SKU-54523', 'BAR-7770896709', '611850', 'Harum dicta rerum saepe sit aliquid id error dignissimos assumenda in vitae eveniet.', 1083.43, 1668.41, 1634.07, 1804.83, 204, NULL, 10, 0, 348, 28.00, 'none', 12.67, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"gray\"}', '1.44 kg', '30x20x15 cm', 3, 7, NULL, 1, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(67, 'Officia dolores', 'SKU-28873', 'BAR-2307832289', '392831', 'Eveniet dolores quod officiis vitae quidem praesentium expedita mollitia fugiat maiores qui eius autem.', 4987.69, 5631.57, 5544.11, 5766.39, 345, NULL, 7, 0, 195, 12.00, 'none', 9.52, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"maroon\"}', '3.35 kg', '20x15x10 cm', 3, 7, NULL, 1, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(68, 'Et fugiat', 'SKU-38072', 'BAR-8303799310', '160135', 'Minima est corrupti natus fuga et commodi voluptatem aliquid facilis reprehenderit soluta sequi.', 4863.86, 5604.46, 5491.23, 5767.57, 411, NULL, 8, 0, 247, 28.00, 'none', 13.05, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"black\"}', '2.85 kg', '20x15x10 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(69, 'Ut ea', 'SKU-22546', 'BAR-5362604520', '766447', 'Consequatur dolores eveniet minus tenetur hic vel.', 1716.47, 2254.65, 2241.79, 2413.03, 418, NULL, 4, 0, 248, 5.00, 'none', 6.99, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"yellow\"}', '0.46 kg', '20x15x10 cm', 3, 7, NULL, 3, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(70, 'Voluptate minus', 'SKU-36268', 'BAR-3591739950', '425465', 'Repellat eum eius et quasi repudiandae earum illo enim sint iure.', 1212.58, 1382.45, 1242.71, 1518.97, 374, NULL, 7, 0, 71, 5.00, 'none', 6.36, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"yellow\"}', '4.24 kg', '10x10x5 cm', 3, 7, NULL, 3, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(71, 'In qui', 'SKU-38395', 'BAR-8841836124', '743900', 'Voluptatem ut qui illo dolor tenetur sequi.', 2421.05, 3019.32, 2992.99, 3386.96, 172, NULL, 5, 0, 194, 28.00, 'none', 12.10, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"gray\"}', '2.47 kg', '30x20x15 cm', 3, 7, NULL, 5, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(72, 'Dicta assumenda', 'SKU-09946', 'BAR-6899616428', '153441', 'Laboriosam ut reiciendis voluptatem veritatis suscipit et modi ad officiis molestiae consequuntur esse.', 3421.08, 3750.58, 3711.98, 3912.13, 96, NULL, 4, 0, 155, 0.00, 'igst', 6.64, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"maroon\"}', '1.94 kg', '30x20x15 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(73, 'Nihil voluptatum', 'SKU-41058', 'BAR-4380717055', '806616', 'Ipsa quod amet fugit maiores sit quis velit magnam amet est.', 4882.02, 5064.86, 4999.07, 5223.16, 316, NULL, 8, 0, 223, 5.00, 'gst', 1.35, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"gray\"}', '0.29 kg', '10x10x5 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(74, 'Qui sunt', 'SKU-23800', 'BAR-0937845738', '155332', 'Animi hic iste perferendis repudiandae dolore dolorem doloribus voluptatem ut harum.', 4436.02, 5174.18, 5037.86, 5241.72, 329, NULL, 6, 0, 373, 0.00, 'igst', 3.76, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"lime\"}', '1.86 kg', '20x15x10 cm', 3, 7, NULL, 1, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(75, 'Sit aut', 'SKU-01071', 'BAR-7249183359', '588241', 'Ut est velit ut in dolorem deserunt omnis cumque.', 2040.15, 2598.61, 2457.49, 2609.10, 175, NULL, 2, 0, 495, 12.00, 'gst', 5.56, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"gray\"}', '0.51 kg', '20x15x10 cm', 3, 7, NULL, 2, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(76, 'Blanditiis molestias', 'SKU-13665', 'BAR-9063010012', '049525', 'Voluptates asperiores vel adipisci omnis perspiciatis at occaecati maxime.', 4010.41, 4215.00, 4169.36, 4698.97, 494, NULL, 8, 0, 488, 5.00, 'none', 14.22, 'percentage', 1, 1, 1, NULL, '[]', '{\"size\":\"L\",\"color\":\"black\"}', '4.37 kg', '30x20x15 cm', 3, 7, NULL, 4, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(77, 'Voluptas ex', 'SKU-98392', 'BAR-4269656031', '979667', 'Itaque mollitia quia sequi ut in minima placeat eum.', 749.06, 1630.25, 1604.38, 1680.20, 306, NULL, 10, 0, 308, 12.00, 'none', 6.35, 'percentage', 1, 1, 1, NULL, '[]', '{\"size\":\"M\",\"color\":\"maroon\"}', '3.34 kg', '30x20x15 cm', 3, 7, NULL, 2, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(78, 'Doloremque at', 'SKU-06846', 'BAR-7099368219', '111958', 'Et ad maxime odit vero eveniet at dolor dolores velit.', 3051.40, 3345.78, 3264.70, 3762.47, 120, NULL, 8, 0, 69, 5.00, 'none', 0.68, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"purple\"}', '4.33 kg', '10x10x5 cm', 3, 7, NULL, 2, '2025-11-08 21:33:45', '2025-11-08 21:33:45'),
(79, 'Aut nemo', 'SKU-70320', 'BAR-5616875194', '957606', 'Dignissimos aliquid alias aut et sit qui ullam voluptates vel occaecati facere.', 2485.85, 2975.73, 2778.72, 3237.70, 106, NULL, 5, 0, 89, 12.00, 'none', 13.08, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"lime\"}', '3.69 kg', '30x20x15 cm', 3, 7, NULL, 1, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(80, 'Ea est', 'SKU-94815', 'BAR-3095302985', '913744', 'In veniam ut accusantium ut doloribus eveniet rerum aspernatur consectetur rerum.', 4180.39, 5004.06, 4809.65, 5353.23, 225, NULL, 2, 0, 342, 12.00, 'igst', 5.99, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"silver\"}', '2.9 kg', '30x20x15 cm', 3, 7, NULL, 2, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(81, 'Rem deleniti', 'SKU-64538', 'BAR-6628984220', '658374', 'Porro nihil et consequatur consequatur odio possimus aut non.', 2842.81, 3193.35, 3178.67, 3569.03, 384, NULL, 8, 0, 81, 28.00, 'gst', 3.50, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"yellow\"}', '4.27 kg', '10x10x5 cm', 3, 7, NULL, 4, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(82, 'Odio reprehenderit', 'SKU-20155', 'BAR-2862939197', '179915', 'Et temporibus nostrum labore molestiae sed consequatur.', 1468.78, 1915.00, 1857.24, 2197.54, 288, NULL, 10, 0, 407, 18.00, 'gst', 5.58, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"fuchsia\"}', '4.92 kg', '10x10x5 cm', 3, 7, NULL, 1, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(83, 'Sed esse', 'SKU-50242', 'BAR-0196609809', '785961', 'Minus quo ut doloribus reiciendis saepe in aliquid.', 1552.54, 1954.45, 1778.73, 2009.00, 435, NULL, 5, 0, 54, 28.00, 'gst', 12.49, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"lime\"}', '3.79 kg', '20x15x10 cm', 3, 7, NULL, 1, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(84, 'Ut animi', 'SKU-25766', 'BAR-5379452793', '790461', 'Ipsum commodi consequatur omnis dolor nihil minima.', 134.62, 763.30, 677.22, 1243.00, 255, NULL, 10, 0, 156, 18.00, 'gst', 7.79, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"gray\"}', '4.18 kg', '20x15x10 cm', 3, 7, NULL, 4, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(85, 'Provident ullam', 'SKU-39557', 'BAR-3892591427', '284695', 'Quisquam qui cumque non amet ad et aliquam sapiente voluptas ullam inventore eligendi.', 1954.47, 2439.51, 2420.47, 2515.63, 465, NULL, 9, 0, 359, 28.00, 'igst', 8.88, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"olive\"}', '3.71 kg', '20x15x10 cm', 3, 7, NULL, 4, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(86, 'Aut illum', 'SKU-84539', 'BAR-5521940688', '229172', 'Ipsa non facere hic sequi possimus sequi ad quaerat sequi asperiores animi quisquam inventore.', 4032.33, 4924.65, 4854.64, 5224.64, 107, NULL, 8, 0, 397, 5.00, 'none', 0.48, 'percentage', 1, 1, 1, NULL, '[]', '{\"size\":\"XL\",\"color\":\"fuchsia\"}', '0.42 kg', '10x10x5 cm', 3, 7, NULL, 5, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(87, 'Qui expedita', 'SKU-48278', 'BAR-3160388624', '929630', 'Consequuntur enim dolores quae impedit est ipsa fugiat.', 1382.31, 1496.53, 1465.56, 1560.05, 382, NULL, 10, 0, 203, 18.00, 'igst', 9.70, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"purple\"}', '1.81 kg', '30x20x15 cm', 3, 7, NULL, 1, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(88, 'At numquam', 'SKU-60192', 'BAR-7712508667', '329159', 'Voluptatem qui ipsum animi molestiae est harum quia autem quibusdam.', 3641.15, 4542.18, 4529.98, 4982.19, 53, NULL, 2, 0, 429, 18.00, 'igst', 8.94, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"fuchsia\"}', '3.16 kg', '10x10x5 cm', 3, 7, NULL, 5, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(89, 'Aliquam error', 'SKU-71474', 'BAR-3310799291', '087368', 'Odio et et voluptatem et modi quis voluptas et consequatur quasi praesentium commodi praesentium.', 4006.92, 4852.63, 4834.58, 5282.34, 492, NULL, 10, 0, 205, 5.00, 'igst', 12.68, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"fuchsia\"}', '1.1 kg', '20x15x10 cm', 3, 7, NULL, 3, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(90, 'Sit assumenda', 'SKU-58736', 'BAR-0039543084', '568215', 'Ut dolorem est eum sit voluptatibus quia voluptatem.', 2938.84, 3766.18, 3731.51, 4193.76, 93, NULL, 9, 0, 371, 18.00, 'none', 8.16, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"green\"}', '4.69 kg', '10x10x5 cm', 3, 7, NULL, 3, '2025-11-08 21:33:46', '2025-11-09 07:27:54'),
(91, 'Accusamus qui', 'SKU-82498', 'BAR-9739364292', '428397', 'Error praesentium et voluptate rerum ut pariatur.', 4415.22, 5162.72, 5151.45, 5258.75, 491, NULL, 10, 0, 247, 12.00, 'gst', 10.88, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"purple\"}', '4.84 kg', '30x20x15 cm', 3, 7, NULL, 2, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(92, 'Omnis voluptates', 'SKU-79949', 'BAR-4638920032', '133978', 'Blanditiis tempore voluptatibus doloremque et quasi rerum qui voluptatem in neque.', 825.43, 839.20, 813.98, 1233.26, 262, NULL, 4, 0, 332, 0.00, 'gst', 5.48, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"blue\"}', '1.25 kg', '20x15x10 cm', 3, 7, NULL, 5, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(93, 'Sunt facilis', 'SKU-84447', 'BAR-8981732625', '333787', 'Molestiae soluta magni ut ex veritatis magni.', 976.54, 1948.91, 1882.97, 2265.46, 420, NULL, 5, 0, 444, 18.00, 'igst', 0.10, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"yellow\"}', '1.7 kg', '10x10x5 cm', 3, 7, NULL, 3, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(94, 'Consequatur repudiandae', 'SKU-58904', 'BAR-8246127005', '416663', 'Ut neque nihil mollitia enim odio est ut amet.', 3231.53, 3495.74, 3304.23, 3598.18, 169, NULL, 9, 0, 152, 18.00, 'gst', 6.23, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"black\"}', '2.04 kg', '20x15x10 cm', 3, 7, NULL, 4, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(95, 'Magni itaque', 'SKU-05430', 'BAR-1539404078', '173617', 'Nobis amet culpa sapiente ipsa nihil sunt rerum provident.', 3348.83, 3902.97, 3743.06, 4069.91, 442, NULL, 8, 0, 236, 0.00, 'none', 5.94, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"yellow\"}', '4.8 kg', '10x10x5 cm', 3, 7, NULL, 4, '2025-11-08 21:33:46', '2025-11-09 07:27:54'),
(96, 'Est fugit', 'SKU-63843', 'BAR-2905995509', '942907', 'Qui dolores aut facere et porro velit nemo est facilis ut est et animi.', 3992.27, 4991.77, 4928.90, 5124.08, 18, NULL, 6, 0, 341, 5.00, 'igst', 11.71, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"aqua\"}', '4.57 kg', '30x20x15 cm', 3, 7, NULL, 3, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(97, 'At officia', 'SKU-88074', 'BAR-6153671247', '262442', 'Sit reiciendis qui voluptatum similique voluptas aspernatur soluta est omnis voluptatem dolores dolorum.', 2649.89, 3442.82, 3308.94, 3830.37, 68, NULL, 8, 0, 221, 12.00, 'igst', 3.23, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"black\"}', '1.73 kg', '10x10x5 cm', 3, 7, NULL, 4, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(98, 'Necessitatibus deserunt', 'SKU-48916', 'BAR-0611501768', '753227', 'Dicta numquam enim neque sed delectus quis quia accusamus ut incidunt.', 2930.61, 3179.13, 2982.34, 3610.38, 399, NULL, 2, 0, 180, 0.00, 'igst', 1.77, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"navy\"}', '3.8 kg', '10x10x5 cm', 3, 7, NULL, 3, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(99, 'Est rerum', 'SKU-91586', 'BAR-9678352236', '216472', 'Omnis rerum mollitia ut asperiores consectetur odio voluptatem doloremque at sint qui incidunt qui.', 3573.74, 3809.70, 3726.61, 3899.38, 239, NULL, 5, 0, 179, 18.00, 'igst', 4.38, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"olive\"}', '2.79 kg', '10x10x5 cm', 3, 7, NULL, 4, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(100, 'Est eaque', 'SKU-52292', 'BAR-0472442052', '978503', 'Magnam voluptatem laborum saepe adipisci esse et repellat nesciunt debitis et voluptatem neque et est.', 3267.78, 3712.77, 3668.90, 3940.51, 450, NULL, 8, 0, 404, 5.00, 'igst', 11.66, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"L\",\"color\":\"aqua\"}', '0.99 kg', '30x20x15 cm', 3, 7, NULL, 5, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(101, 'Quis dolorum', 'SKU-27827', 'BAR-4080386015', '608732', 'Quae odio necessitatibus aut beatae qui placeat.', 4286.30, 4939.27, 4800.93, 5403.56, 112, NULL, 6, 0, 132, 12.00, 'igst', 7.25, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"gray\"}', '0.77 kg', '20x15x10 cm', 3, 7, NULL, 4, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(102, 'Optio voluptate', 'SKU-95258', 'BAR-7419668426', '185936', 'Molestias alias odit non saepe esse occaecati molestiae aut nihil id.', 2840.85, 3305.17, 3106.65, 3754.86, 311, NULL, 2, 0, 364, 28.00, 'gst', 5.88, 'percentage', 1, 1, 1, NULL, '[]', '{\"size\":\"S\",\"color\":\"white\"}', '4.28 kg', '20x15x10 cm', 3, 7, NULL, 1, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(103, 'Suscipit id', 'SKU-11930', 'BAR-0777578426', '449960', 'Molestiae quia deserunt nesciunt pariatur repellendus in earum suscipit reiciendis consequatur eius ut ullam.', 1155.96, 1222.80, 1074.05, 1491.53, 496, NULL, 6, 0, 437, 0.00, 'gst', 8.96, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"silver\"}', '0.89 kg', '30x20x15 cm', 3, 7, NULL, 3, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(104, 'Asperiores nesciunt', 'SKU-98851', 'BAR-1478760503', '309723', 'Ut eveniet aut placeat sint repellat laboriosam quis repellat illo.', 3065.03, 3223.92, 3129.25, 3327.04, 304, NULL, 8, 0, 120, 28.00, 'none', 11.27, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"teal\"}', '3.34 kg', '30x20x15 cm', 3, 7, NULL, 5, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(105, 'Aut nesciunt', 'SKU-19094', 'BAR-7081279721', '204981', 'Repellat sit dolores saepe repellat doloribus ea possimus sit ut quo dignissimos et.', 2532.37, 3157.18, 3024.26, 3169.45, 439, NULL, 2, 0, 108, 5.00, 'gst', 3.74, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"purple\"}', '4.36 kg', '20x15x10 cm', 3, 7, NULL, 4, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(106, 'Nemo est', 'SKU-95501', 'BAR-2698598596', '820282', 'Sed quisquam dolorem quia aliquid voluptas quibusdam officia dolorem quia quis et.', 3653.99, 4080.95, 3929.47, 4389.39, 220, NULL, 5, 0, 490, 5.00, 'none', 12.56, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"green\"}', '4.83 kg', '30x20x15 cm', 3, 7, NULL, 2, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(107, 'Est dolores', 'SKU-92008', 'BAR-8908940181', '583108', 'Molestiae architecto illum nobis iusto vel amet ut consequatur.', 1367.69, 1851.50, 1655.37, 2307.63, 405, NULL, 3, 0, 205, 5.00, 'igst', 11.97, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"M\",\"color\":\"silver\"}', '3.71 kg', '30x20x15 cm', 3, 7, NULL, 3, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(108, 'At quasi', 'SKU-34584', 'BAR-2947730911', '068153', 'Nemo eaque commodi sed possimus quia quis ut ut sunt aut accusamus.', 2531.88, 3417.58, 3226.30, 3832.33, 410, NULL, 8, 0, 382, 12.00, 'igst', 6.99, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"maroon\"}', '1.32 kg', '10x10x5 cm', 3, 7, NULL, 5, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(109, 'Dolores quos', 'SKU-03730', 'BAR-3480731103', '669215', 'At dicta veniam itaque quia expedita omnis qui perferendis et ullam.', 2642.54, 3413.90, 3227.88, 3751.52, 216, NULL, 8, 0, 328, 18.00, 'gst', 9.00, 'percentage', 1, 1, 1, NULL, '[]', '{\"size\":\"L\",\"color\":\"silver\"}', '4.98 kg', '20x15x10 cm', 3, 7, NULL, 4, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(110, 'Doloremque quia', 'SKU-58761', 'BAR-5432288172', '981438', 'Itaque at sint inventore et eligendi impedit omnis nihil.', 2905.86, 3721.23, 3600.18, 4108.25, 311, NULL, 6, 0, 460, 0.00, 'none', 4.94, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"lime\"}', '0.92 kg', '30x20x15 cm', 3, 7, NULL, 2, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(111, 'Doloribus omnis', 'SKU-12250', 'BAR-5422429173', '197407', 'Non consequatur voluptates placeat dolorum quo repellat tempore iste quia ut assumenda quibusdam eveniet.', 2670.99, 3098.48, 2993.01, 3536.76, 62, NULL, 9, 0, 428, 18.00, 'none', 14.42, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"S\",\"color\":\"silver\"}', '0.58 kg', '30x20x15 cm', 3, 7, NULL, 1, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(112, 'Sint ad', 'SKU-64084', 'BAR-9889195566', '030314', 'Id sed natus qui amet veniam optio quisquam.', 54.98, 188.82, 86.53, 579.22, 155, NULL, 7, 0, 468, 18.00, 'none', 1.33, 'percentage', 1, 1, 1, NULL, '[]', '{\"size\":\"L\",\"color\":\"aqua\"}', '4.51 kg', '20x15x10 cm', 3, 7, NULL, 3, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(113, 'Quia vero', 'SKU-11490', 'BAR-7877415392', '230688', 'Id autem natus hic beatae animi quisquam commodi provident quae a eligendi sit hic.', 3335.51, 3559.56, 3369.08, 3969.73, 494, NULL, 3, 0, 153, 0.00, 'igst', 2.57, 'percentage', 1, 1, 0, NULL, '[]', '{\"size\":\"XL\",\"color\":\"silver\"}', '2.53 kg', '20x15x10 cm', 3, 7, NULL, 5, '2025-11-08 21:33:46', '2025-11-08 21:33:46'),
(114, 'dsafsdadfsdf', 'VB34ZCML', '194472682395', NULL, NULL, 0.00, 0.00, 0.00, 0.00, 0, '2025-11-09', 5, 0, NULL, 0.00, 'gst', 0.00, 'percentage', 1, 1, 0, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, '2025-11-08 21:58:00', '2025-11-08 21:58:00'),
(115, 'testerm naveen', 'WRJQRC7G', '762156734806', NULL, NULL, 0.00, 0.00, 0.00, 0.00, 0, '2025-11-09', 5, 0, NULL, 0.00, 'gst', 0.00, 'percentage', 1, 1, 0, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, '2025-11-08 21:58:25', '2025-11-08 21:58:25'),
(116, 'testerm naveen', 'FSLNFQ5R', '540195495427', NULL, NULL, 0.00, 0.00, 0.00, 0.00, 0, '2025-11-09', 5, 0, NULL, 0.00, 'gst', 0.00, 'percentage', 1, 1, 0, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, '2025-11-08 21:58:44', '2025-11-08 21:58:44'),
(117, 'fdsafdsafd', 'GV6PZHIG', '729485414869', NULL, NULL, 0.00, 0.00, 0.00, 0.00, 0, '2025-11-09', 5, 0, NULL, 0.00, 'gst', 0.00, 'percentage', 1, 1, 0, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, '2025-11-08 22:06:29', '2025-11-08 22:06:29'),
(118, 'fdsafsdafds', 'SHYS4JPR', '116856065613', NULL, NULL, 0.00, 0.00, 0.00, 0.00, 0, '2025-11-09', 5, 0, NULL, 0.00, 'gst', 0.00, 'percentage', 1, 1, 0, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, '2025-11-09 08:41:29', '2025-11-09 08:41:29');

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `purchase_number` varchar(255) NOT NULL,
  `bill_number` varchar(255) DEFAULT NULL,
  `purchase_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `status` enum('draft','pending','received','partially_received','cancelled','returned') NOT NULL,
  `payment_status` enum('pending','partial','paid','overdue') NOT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `shipping_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paid_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `balance_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `taxable_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cgst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sgst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `igst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cess_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `notes` varchar(255) DEFAULT NULL,
  `terms_and_conditions` varchar(255) DEFAULT NULL,
  `received_date` date DEFAULT NULL,
  `paid_date` date DEFAULT NULL,
  `is_return` tinyint(1) NOT NULL DEFAULT 0,
  `return_reason` varchar(255) DEFAULT NULL,
  `is_draft` tinyint(1) NOT NULL DEFAULT 0,
  `is_cancelled` tinyint(1) NOT NULL DEFAULT 0,
  `cancelled_date` date DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `custom_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_fields`)),
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_items`
--

CREATE TABLE `purchase_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `item_type` varchar(255) NOT NULL DEFAULT 'product',
  `name` varchar(255) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity` decimal(10,3) NOT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `taxable_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `cgst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sgst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `igst_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cess_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cgst_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `sgst_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `igst_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `cess_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `hsn_code` varchar(255) DEFAULT NULL,
  `tax_type` varchar(255) NOT NULL DEFAULT 'gst',
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attributes`)),
  `received_quantity` int(11) NOT NULL DEFAULT 0,
  `pending_quantity` int(11) NOT NULL DEFAULT 0,
  `return_quantity` int(11) NOT NULL DEFAULT 0,
  `return_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `purchase_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 1,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `business_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `slug`, `description`, `color`, `is_active`, `is_system`, `level`, `permissions`, `metadata`, `business_id`, `created_at`, `updated_at`) VALUES
(1, 'Owner', 'owner', 'Business owner with full permissions', NULL, 1, 1, 1, NULL, NULL, NULL, NULL, NULL),
(2, 'Staff', 'staff', 'Can manage products, customers, and invoices', NULL, 1, 0, 2, NULL, NULL, NULL, NULL, NULL),
(3, 'Admin', 'admin', 'System admin for all businesses', NULL, 1, 1, 0, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `can_view` tinyint(1) NOT NULL DEFAULT 0,
  `can_create` tinyint(1) NOT NULL DEFAULT 0,
  `can_update` tinyint(1) NOT NULL DEFAULT 0,
  `can_delete` tinyint(1) NOT NULL DEFAULT 0,
  `conditions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`conditions`)),
  `restrictions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`restrictions`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('94ZdXNEXWVKlEKDh1iVlULugmaBWbA6ceI5izbgh', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidXZiR1FTY3pjSTlVcWdxejVWUEgwOUxIcUlWYnB3YjdDekJWNWNZeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1763030425),
('cX7hsJPDd16RTRvimtBxUlfTk5ChXXaoo0BHNMx8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZk5ONXJibnRTODRhdXJJeU5UeDVUVGR5WXpIc0JlOFlPeE9qT2dzZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9jcmVhdGUtc2FsZXMtaW52b2ljZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1762937406),
('FjJqLNncRFnePZHM0Tq2GxljtrLts4NNyLy81tsH', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY0R4enpNeDY3a2ttZnBFVHA2TFlEQ0dtZVh4UlNVNWEzM3R0NklPYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1763030430);

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(5) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `states`
--

INSERT INTO `states` (`id`, `name`, `code`, `created_at`, `updated_at`) VALUES
(1, 'Andhra Pradesh', 'AP', NULL, NULL),
(2, 'Arunachal Pradesh', 'AR', NULL, NULL),
(3, 'Assam', 'AS', NULL, NULL),
(4, 'Bihar', 'BR', NULL, NULL),
(5, 'Chhattisgarh', 'CG', NULL, NULL),
(6, 'Goa', 'GA', NULL, NULL),
(7, 'Gujarat', 'GJ', NULL, NULL),
(8, 'Haryana', 'HR', NULL, NULL),
(9, 'Himachal Pradesh', 'HP', NULL, NULL),
(10, 'Jharkhand', 'JH', NULL, NULL),
(11, 'Karnataka', 'KA', NULL, NULL),
(12, 'Kerala', 'KL', NULL, NULL),
(13, 'Madhya Pradesh', 'MP', NULL, NULL),
(14, 'Maharashtra', 'MH', NULL, NULL),
(15, 'Manipur', 'MN', NULL, NULL),
(16, 'Meghalaya', 'ML', NULL, NULL),
(17, 'Mizoram', 'MZ', NULL, NULL),
(18, 'Nagaland', 'NL', NULL, NULL),
(19, 'Odisha', 'OR', NULL, NULL),
(20, 'Punjab', 'PB', NULL, NULL),
(21, 'Rajasthan', 'RJ', NULL, NULL),
(22, 'Sikkim', 'SK', NULL, NULL),
(23, 'Tamil Nadu', 'TN', NULL, NULL),
(24, 'Telangana', 'TS', NULL, NULL),
(25, 'Tripura', 'TR', NULL, NULL),
(26, 'Uttar Pradesh', 'UP', NULL, NULL),
(27, 'Uttarakhand', 'UK', NULL, NULL),
(28, 'West Bengal', 'WB', NULL, NULL),
(29, 'Andaman and Nicobar Islands', 'AN', NULL, NULL),
(30, 'Chandigarh', 'CH', NULL, NULL),
(31, 'Dadra and Nagar Haveli and Daman and Diu', 'DN', NULL, NULL),
(32, 'Delhi', 'DL', NULL, NULL),
(33, 'Jammu and Kashmir', 'JK', NULL, NULL),
(34, 'Ladakh', 'LA', NULL, NULL),
(35, 'Lakshadweep', 'LD', NULL, NULL),
(36, 'Puducherry', 'PY', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `supplier_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `alternate_phone` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `gstin` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `opening_balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `current_balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `credit_limit` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payment_terms` int(11) NOT NULL DEFAULT 0,
  `total_purchases` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_orders` int(11) NOT NULL DEFAULT 0,
  `last_order_date` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `notes` text DEFAULT NULL,
  `custom_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_fields`)),
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `symbol` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `name`, `symbol`, `description`, `is_active`, `business_id`, `created_at`, `updated_at`) VALUES
(1, 'Pieces', 'pcs', 'Single item or piece count', 1, 3, '2025-11-07 11:27:19', '2025-11-07 11:27:19'),
(2, 'Kilogram', 'kg', 'Used for weight-based products', 1, 3, '2025-11-07 11:27:19', '2025-11-07 11:27:19'),
(3, 'Gram', 'g', 'Used for smaller weight units', 1, 3, '2025-11-07 11:27:19', '2025-11-07 11:27:19'),
(4, 'Liter', 'L', 'Used for liquid products', 1, 3, '2025-11-07 11:27:19', '2025-11-07 11:27:19'),
(5, 'Milliliter', 'ml', 'Used for small volume liquids', 1, 3, '2025-11-07 11:27:19', '2025-11-07 11:27:19'),
(6, 'Box', 'box', 'Used for products sold in boxes or cartons', 1, 3, '2025-11-07 11:27:19', '2025-11-07 11:27:19'),
(7, 'Packet', 'pkt', 'Used for packaged goods', 1, 3, '2025-11-07 11:27:19', '2025-11-07 11:27:19'),
(8, 'Meter', 'm', 'Used for length or distance measurements', 1, 3, '2025-11-07 11:27:19', '2025-11-07 11:27:19'),
(9, 'Dozen', 'dz', 'Set of twelve items', 1, 3, '2025-11-07 11:27:19', '2025-11-07 11:27:19'),
(10, 'Pair', 'pr', 'Used for items sold in pairs (e.g., shoes, gloves)', 1, 3, '2025-11-07 11:27:19', '2025-11-07 11:27:19');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Test User', 'test@example.com', '2025-11-07 00:37:23', '$2y$12$D6jmOvztTheYTS6BB7TXd.tNgk3OI7A9y..6EhENABKjwfKZerXYO', 'LetRrbXbZw', '2025-11-07 00:37:23', '2025-11-07 00:37:23'),
(8, 'Demo Owner', 'owner@test.com', NULL, '$2y$12$epP49Qgw9xGnaELXOgZx/ej5uA7NuYrmWbOksL4wJeMfyDn3x4FYa', NULL, '2025-11-07 01:13:25', '2025-11-07 01:13:25'),
(9, 'Demo Owner2', 'naveen.webadsmedia@gmail.com', NULL, '$2y$12$epP49Qgw9xGnaELXOgZx/ej5uA7NuYrmWbOksL4wJeMfyDn3x4FYa', NULL, '2025-11-07 01:13:25', '2025-11-07 01:13:25');

-- --------------------------------------------------------

--
-- Table structure for table `user_businesses`
--

CREATE TABLE `user_businesses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `business_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'links to roles table',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `assigned_by_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `assigned_by_type` varchar(255) NOT NULL DEFAULT 'system',
  `joined_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_businesses`
--

INSERT INTO `user_businesses` (`id`, `user_id`, `business_id`, `role_id`, `is_active`, `assigned_by_id`, `assigned_by_type`, `joined_at`, `created_at`, `updated_at`) VALUES
(1, 8, 3, 1, 1, 0, 'system', NULL, '2025-11-07 01:13:25', '2025-11-07 01:13:25');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `expires_at` date DEFAULT NULL,
  `conditions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`conditions`)),
  `restrictions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`restrictions`)),
  `assigned_by_type` varchar(255) DEFAULT NULL,
  `assigned_by_id` bigint(20) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `business_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `is_active`, `expires_at`, `conditions`, `restrictions`, `assigned_by_type`, `assigned_by_id`, `notes`, `user_id`, `role_id`, `business_id`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, NULL, NULL, NULL, NULL, NULL, 8, 1, NULL, '2025-11-10 01:57:29', '2025-11-10 01:57:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `brands_slug_unique` (`slug`),
  ADD KEY `brands_business_id_foreign` (`business_id`);

--
-- Indexes for table `businesses`
--
ALTER TABLE `businesses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `businesses_email_unique` (`email`),
  ADD KEY `businesses_owner_id_foreign` (`owner_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`),
  ADD KEY `categories_business_id_foreign` (`business_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customers_customer_code_unique` (`customer_code`),
  ADD KEY `customers_business_id_foreign` (`business_id`);

--
-- Indexes for table `estimates`
--
ALTER TABLE `estimates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `estimates_estimate_number_unique` (`estimate_number`),
  ADD KEY `estimates_business_id_foreign` (`business_id`),
  ADD KEY `estimates_customer_id_foreign` (`customer_id`),
  ADD KEY `estimates_created_by_foreign` (`created_by`);

--
-- Indexes for table `estimate_items`
--
ALTER TABLE `estimate_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estimate_items_estimate_id_foreign` (`estimate_id`),
  ADD KEY `estimate_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `expenses_expense_number_unique` (`expense_number`),
  ADD KEY `expenses_business_id_foreign` (`business_id`),
  ADD KEY `expenses_expense_category_id_foreign` (`expense_category_id`),
  ADD KEY `expenses_supplier_id_foreign` (`supplier_id`),
  ADD KEY `expenses_created_by_foreign` (`created_by`);

--
-- Indexes for table `expense_categories`
--
ALTER TABLE `expense_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `expense_categories_slug_unique` (`slug`),
  ADD KEY `expense_categories_business_id_foreign` (`business_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `industry_types`
--
ALTER TABLE `industry_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `industry_types_name_unique` (`name`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_number_unique` (`order_number`),
  ADD UNIQUE KEY `orders_invoice_number_unique` (`invoice_number`),
  ADD KEY `orders_business_id_foreign` (`business_id`),
  ADD KEY `orders_customer_id_foreign` (`customer_id`),
  ADD KEY `orders_supplier_id_foreign` (`supplier_id`),
  ADD KEY `orders_created_by_foreign` (`created_by`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_payment_number_unique` (`payment_number`),
  ADD KEY `payments_business_id_foreign` (`business_id`),
  ADD KEY `payments_order_id_foreign` (`order_id`),
  ADD KEY `payments_purchase_id_foreign` (`purchase_id`),
  ADD KEY `payments_expense_id_foreign` (`expense_id`),
  ADD KEY `payments_customer_id_foreign` (`customer_id`),
  ADD KEY `payments_supplier_id_foreign` (`supplier_id`),
  ADD KEY `payments_received_by_foreign` (`received_by`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_slug_unique` (`slug`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_sku_unique` (`sku`),
  ADD UNIQUE KEY `products_barcode_unique` (`barcode`),
  ADD KEY `products_business_id_foreign` (`business_id`),
  ADD KEY `products_category_id_foreign` (`category_id`),
  ADD KEY `products_brand_id_foreign` (`brand_id`),
  ADD KEY `products_unit_id_foreign` (`unit_id`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `purchases_purchase_number_unique` (`purchase_number`),
  ADD KEY `purchases_business_id_foreign` (`business_id`),
  ADD KEY `purchases_supplier_id_foreign` (`supplier_id`),
  ADD KEY `purchases_created_by_foreign` (`created_by`);

--
-- Indexes for table `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_items_purchase_id_foreign` (`purchase_id`),
  ADD KEY `purchase_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_slug_unique` (`slug`),
  ADD KEY `roles_business_id_foreign` (`business_id`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_permissions_role_id_foreign` (`role_id`),
  ADD KEY `role_permissions_permission_id_foreign` (`permission_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `states_name_unique` (`name`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `suppliers_supplier_code_unique` (`supplier_code`),
  ADD KEY `suppliers_business_id_foreign` (`business_id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`),
  ADD KEY `units_business_id_foreign` (`business_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_businesses`
--
ALTER TABLE `user_businesses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_businesses_user_id_foreign` (`user_id`),
  ADD KEY `user_businesses_business_id_foreign` (`business_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_roles_user_id_foreign` (`user_id`),
  ADD KEY `user_roles_role_id_foreign` (`role_id`),
  ADD KEY `user_roles_business_id_foreign` (`business_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `businesses`
--
ALTER TABLE `businesses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `estimates`
--
ALTER TABLE `estimates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `estimate_items`
--
ALTER TABLE `estimate_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expense_categories`
--
ALTER TABLE `expense_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `industry_types`
--
ALTER TABLE `industry_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_items`
--
ALTER TABLE `purchase_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user_businesses`
--
ALTER TABLE `user_businesses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `brands`
--
ALTER TABLE `brands`
  ADD CONSTRAINT `brands_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `businesses`
--
ALTER TABLE `businesses`
  ADD CONSTRAINT `businesses_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `estimates`
--
ALTER TABLE `estimates`
  ADD CONSTRAINT `estimates_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `estimates_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `estimates_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `estimate_items`
--
ALTER TABLE `estimate_items`
  ADD CONSTRAINT `estimate_items_estimate_id_foreign` FOREIGN KEY (`estimate_id`) REFERENCES `estimates` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `estimate_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expenses_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `expenses_expense_category_id_foreign` FOREIGN KEY (`expense_category_id`) REFERENCES `expense_categories` (`id`),
  ADD CONSTRAINT `expenses_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `expense_categories`
--
ALTER TABLE `expense_categories`
  ADD CONSTRAINT `expense_categories_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payments_expense_id_foreign` FOREIGN KEY (`expense_id`) REFERENCES `expenses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payments_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payments_received_by_foreign` FOREIGN KEY (`received_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `payments_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchases_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `purchases_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);

--
-- Constraints for table `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD CONSTRAINT `purchase_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `purchase_items_purchase_id_foreign` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD CONSTRAINT `suppliers_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `units`
--
ALTER TABLE `units`
  ADD CONSTRAINT `units_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_businesses`
--
ALTER TABLE `user_businesses`
  ADD CONSTRAINT `user_businesses_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_businesses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
