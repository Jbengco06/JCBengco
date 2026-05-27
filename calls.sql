Select * From calls limit 10;


Create table calls(
ID char(50),
cust_name char(50),
sentiment char (20),
csat_score int,
call_timestamp char(10),
reason char (20),
city char (20),
state char(20),
channel char (20),
response_time char (20),
call_duration_minutes int,
call_center char (20)
);

