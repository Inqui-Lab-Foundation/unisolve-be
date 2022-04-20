SELECT * FROM `dbunisolve`.`student` LIMIT 100;
DELETE FROM `dbunisolve`.`student` WHERE Email in ('test128@unisolve.org', 'test123@unisolve.org');
DROP TABLE `dbunisolve`.`user`;