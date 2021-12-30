-- COMMANDS FOR SETTING UP THE DATABASE ON SQL WORKBENCH -NOT NEEDED FOR RUNNING THE APPLICATION
-- DB INITIALIZED on Heroku server
USE heroku_e1e76fe8235c177

-- users table
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email_id` varchar(45) NOT NULL,
  `full_name` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8;

-- company table

CREATE TABLE `company` (
  `company_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(45) NOT NULL,
  `company_description` varchar(45) DEFAULT NULL,
  `company_ticker` varchar(45) NOT NULL,
  PRIMARY KEY (`company_id`),
  UNIQUE KEY `company_name_UNIQUE` (`company_name`)
) ENGINE=InnoDB AUTO_INCREMENT=194 DEFAULT CHARSET=utf8;

-- user_company_association table

CREATE TABLE `user_company_association` (
  `user_company_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  PRIMARY KEY (`user_company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=254 DEFAULT CHARSET=utf8;

-- user_portfolio table

CREATE TABLE `user_portfolio` (
  `portfolio_entry` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `company_ticker` varchar(45) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_bought` int(11) NOT NULL,
  PRIMARY KEY (`portfolio_entry`)
) ENGINE=InnoDB AUTO_INCREMENT=204 DEFAULT CHARSET=utf8;


-- registered_users table

CREATE TABLE `registered_users` (
  `user_email_id` varchar(60) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_full_name` varchar(60) NOT NULL,
  PRIMARY KEY (`user_email_id`),
  UNIQUE KEY `user_email_id_UNIQUE` (`user_email_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- STORED PROCEDURES
-- A.
DELIMITER $$
CREATE DEFINER=`baa84596ba9cb0`@`%` PROCEDURE `UsersAddOrEdit`(
	IN _user_id INT,
    IN _email_id varchar(75),
    IN _full_name varchar(50)
)
BEGIN

	IF _user_id=0 THEN
		INSERT INTO users(email_id,full_name)
        VALUES (_email_id,_full_name);
        
        SET _user_id = LAST_INSERT_ID();
	ELSE
		UPDATE users
        SET
        email_id = _email_id,
        full_name = _full_name
        WHERE user_id = _user_id;
        
	END IF;
        
    SELECT _user_id AS 'user_id';     
END$$
DELIMITER ;

-- B.

DELIMITER $$
CREATE DEFINER=`baa84596ba9cb0`@`%` PROCEDURE `CompanyAddOrEdit`(
	IN _company_id INT,
    IN _company_name varchar(50),
    IN _company_description varchar(200),
    IN _company_ticker VARCHAR(8)
)
BEGIN

	IF _company_id = 0 THEN
		INSERT INTO company(company_name,company_description,company_ticker)
        VALUES (_company_name,_company_description,_company_ticker);
        
        SET _company_id = LAST_INSERT_ID();
	ELSE
		UPDATE company
        SET
        company_name = _company_name,
        company_description = _company_description,
        company_ticker = _company_ticker
        
        WHERE company_id = _company_id;
        
	END IF;
        
    SELECT _company_id AS 'company_id';     
END$$
DELIMITER ;


-- C.

DELIMITER $$
CREATE DEFINER=`baa84596ba9cb0`@`%` PROCEDURE `AddUserWatchList`(
	IN _user_company_id INT,
    IN _user_id INT,
    IN _company_id INT
)
BEGIN

	IF _user_company_id = 0 THEN
		INSERT INTO user_company_association(user_id,company_id)
        VALUES (_user_id,_company_id);
        
        SET _user_company_id = LAST_INSERT_ID();
	ELSE
		UPDATE user_company_association
        SET
        user_id = _user_id,
        company_id = _company_id
        WHERE user_company_id = _user_company_id;
        
	END IF;
        
    SELECT _user_company_id AS 'user_company_id';     
END$$
DELIMITER ;


-- D.

DELIMITER $$
CREATE DEFINER=`baa84596ba9cb0`@`%` PROCEDURE `AddToPortfolio`(
IN _portfolio_entry INT,
IN _user_id INT,
IN _company_ticker VARCHAR(10),
IN _quantity INT,
IN _price_bought INT
)
BEGIN

IF _portfolio_entry=0 THEN

INSERT INTO user_portfolio(user_id,company_ticker,quantity,price_bought)
VALUES (_user_id,_company_ticker,_quantity,_price_bought);
SET _portfolio_entry = last_insert_id();

ELSE

	UPDATE user_portfolio
	SET
	quantity = _quantity,
	price_bought=_price_bought
	WHERE user_id = _user_id
	AND portfolio_entry =_portfolio_entry
	AND company_ticker = _company_ticker;

END IF;
SELECT _portfolio_entry AS 'portfolio_entry';
END$$
DELIMITER ;



