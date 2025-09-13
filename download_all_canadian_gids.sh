#!/bin/bash

# Download all Canadian GID CSVs
echo "Downloading all Canadian GID CSVs..."

# Create directory
mkdir -p csv_data/canada
cd csv_data/canada

# Download system CSVs
echo "Downloading system CSVs..."
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=888205070" > year.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=895613602" > truck_storage.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=2046372794" > time_zones.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=885243828" > discounts.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=34029782" > deposit_amounts.csv

# Download location CSVs
echo "Downloading location CSVs..."
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=586231927" > abbotsford.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=759134820" > ajax.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=2023718082" > aurora.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=205064403" > barrie.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1902434505" > brantford.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=685880450" > burlington.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1985906253" > burnaby.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1384980803" > calgary.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=2061150538" > coquitlam.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1324028052" > downtown_toronto.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1846632241" > edmonton.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=627208617" > fredericton.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1843371269" > halifax.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=858770585" > hamilton.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=551728640" > kelowna.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=478561055" > kingston.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1613243722" > lethbridge.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1311971885" > london.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=853107228" > markham.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=120281503" > milton.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=429580526" > mississauga.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=159313789" > moncton.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1591534972" > montreal.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=851484086" > oakville.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=225755820" > montreal_north.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=805965695" > oshawa.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=268519783" > ottawa.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1005327863" > peterborough.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1911372332" > regina.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=2065291362" > saint_john.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=232402855" > saskatoon.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=2119220503" > scarborough.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1460907060" > st_catherines.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1342606267" > richmond_bc.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=992379054" > surrey.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=348861685" > toronto_north_york.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=445545962" > vancouver.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1604601748" > vaughan.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1211144815" > victoria_island.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1802285746" > waterloo.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=322544773" > winnipeg.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1257914670" > windsor.csv
curl -s -L "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=1904136712" > not_active_north_vancouver.csv

echo "Download complete! Files saved in csv_data/canada/"
ls -la
