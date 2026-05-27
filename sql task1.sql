`call center``call center`calls-- The call_timestamp is a string, so we need to convert it to a date.

SET SQL_SAFE_UPDATES = 0;

UPDATE calls 
SET call_timestamp = str_to_date(call_timestamp, "%m/%d/%Y");

UPDATE calls 
SET csat_score = NULL 
WHERE csat_score = 0;

SET SQL_SAFE_UPDATES = 1;

SELECT COUNT(*) AS rows_num FROM calls;
SELECT COUNT(*) AS cols_num FROM information_schema.columns WHERE table_name = 'calls';

SELECT DISTINCT sentiment FROM calls;
SELECT DISTINCT reason FROM calls;
SELECT DISTINCT channel FROM calls;
SELECT DISTINCT response_time FROM calls;
SELECT DISTINCT call_center FROM calls;

SELECT sentiment, count(*), ROUND((COUNT(*) / (SELECT COUNT(*) FROM calls)) * 100, 1) AS pct
FROM calls GROUP BY 1 ORDER BY 3 DESC;
SELECT reason, count(*), ROUND((COUNT(*) / (SELECT COUNT(*) FROM calls)) * 100, 1) AS pct
FROM calls GROUP BY 1 ORDER BY 3 DESC;
SELECT channel, count(*), ROUND((COUNT(*) / (SELECT COUNT(*) FROM calls)) * 100, 1) AS pct
FROM calls GROUP BY 1 ORDER BY 3 DESC;
SELECT response_time, count(*), ROUND((COUNT(*) / (SELECT COUNT(*) FROM calls)) * 100, 1) AS pct
FROM calls GROUP BY 1 ORDER BY 3 DESC;
SELECT call_center, count(*), ROUND((COUNT(*) / (SELECT COUNT(*) FROM calls)) * 100, 1) AS pct
FROM calls GROUP BY 1 ORDER BY 3 DESC;
SELECT state, COUNT(*) FROM calls GROUP BY 1 ORDER BY 2 DESC;



SELECT MIN(csat_score) AS min_score, MAX(csat_score) AS max_score, ROUND(AVG(csat_score),1) AS avg_score
FROM calls WHERE csat_score != 0; -- MySql added the blank rows. But the min is 1.

SELECT MIN(call_timestamp) AS earliest_date, MAX(call_timestamp) AS most_recent FROM calls;

SELECT MIN(call_duration_minutes) AS min_call_duration, MAX(call_duration_minutes) AS max_call_duration,
AVG(call_duration_minutes) AS avg_call_duration FROM calls;

SELECT call_center, response_time, COUNT(*) AS count
FROM calls GROUP BY 1,2 ORDER BY 1,3 DESC;

SELECT call_center, AVG(call_duration_minutes)
FROM calls GROUP BY 1 ORDER BY 2 DESC;

SELECT channel, AVG(call_duration_minutes)
FROM calls GROUP BY 1 ORDER BY 2 DESC;

SELECT state, COUNT(*)
FROM calls GROUP BY 1 ORDER BY 2 DESC;

SELECT reason, COUNT(*)
FROM calls GROUP BY 1,2 ORDER BY 1,2,3 DESC;

SELECT state, sentiment, COUNT(*)
FROM calls GROUP BY 1,2 ORDER BY 1,3 DESC;

SELECT state, AVG(csat_score) AS avg_csat_score
FROM calls WHERE csat_score != 0
GROUP BY 1 ORDER BY 2 DESC;

SELECT sentiment, AVG(call_duration_minutes)
FROM calls GROUP BY 1 ORDER BY 2 DESC;