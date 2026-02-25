export default {
    id: 'sql-injection',
    title: 'SQL Injection',
    category: 'TryHackMe',
    difficulty: 'Medium',
    tags: ['SQL Injection'],
    date: '2026-02-24T12:00:00',
    excerpt: 'Write up and walkthrough of SQL Injection room on TryHackMe.',
    content: `
This is a write up and walkthrough of the SQL Injection room on TryHackMe.

⸻⸻⸻⸻⸻

### Task 1 Brief

SQL (Structured Query Language) Injection, mostly referred to as SQLi, is an attack on a web application database server that causes malicious queries to be executed. When a web application communicates with a database using input from a user that hasn't been properly validated, there runs the potential of an attacker being able to steal, delete or alter private and customer data and also attack the web application authentication methods to private or customer areas. This is why SQLi is one of the oldest web application vulnerabilities, and it can also be the most damaging.

In this room, you'll learn what databases are, what SQL is with some basic SQL commands, how to detect SQL vulnerabilities, how to exploit SQLi vulnerabilities and, as a developer, how you can protect yourself against SQL Injection.

**Answer the questions below**⸻⸻⸻⸻⸻

What does SQL stand for?
**Answer:** Structured Query Language

⸻⸻⸻⸻⸻

### Task 2 What is a Database?

If you're not used to working with databases or exploiting them, there's probably some new terminology to get used to, so let's start with some basics on how databases are structured and how they work.

**What is a database?**
A database is a way of electronically storing collections of data in an organised manner. A database is controlled by a DBMS, which is an acronym for  Database Management System. DBMSs fall into two camps: Relational and Non-Relational; the focus of this room will be on Relational databases; some common ones you'll come across are MySQL, Microsoft SQL Server, Access, PostgreSQL and SQLite. We'll explain the difference between Relational and Non-Relational databases at the end of this task, but first, it's important to learn a few terms.

Within a DBMS, you can have multiple databases, each containing its own set of related data. For example, you may have a database called "**shop**". Within this database, you want to store information about products available to purchase, users who have signed up to your online shop, and information about the orders you've received. You'd store this information separately in the database using something called tables. The tables are identified with a unique name for each one. You can see this structure in the diagram below, but you can also see how a business might have other separate databases to store staff information or the accounts team.

**What are tables?**
A table is made up of columns and rows; a useful way to imagine a table is like a grid with the columns going across the top from left to right containing the name of the cell and the rows going from top to bottom, with each one having the actual data.

**Columns:**
Each column, better referred to as a field, has a unique name per table. When creating a column, you also set the type of data it will contain, common ones being integers (numbers), strings (standard text) or dates. Some databases can contain much more complex data, such as geospatial, which contains location information. Setting the data type also ensures that incorrect information isn't stored, such as the string "hello world" being stored in a column meant for dates. If this happens, the database server will usually produce an error message. A column containing an integer can also have an auto-increment feature enabled; this gives each row of data a unique number that grows (increments) with each subsequent row. Doing so creates what is called a key field; a key field has to be unique for every row of data, which can be used to find that exact row in SQL queries.

**Rows:**
Rows or records contain individual lines of data. When you add data to the table, a new row/record is created; when you delete data, a row/record is removed.

**Relational Vs Non-Relational Databases:**
A relational database stores information in tables, and often, the tables share information between them; they use columns to specify and define the data being stored and rows actually to store the data. The tables will often contain a column that has a unique ID (primary key), which will then be used in other tables to reference it and cause a relationship between the tables, hence the name relational database.

Non-relational databases, sometimes called NoSQL, on the other hand, are any sort of database that doesn't use tables, columns and rows to store the data. A specific database layout doesn't need to be constructed so each row of data can contain different information, giving more flexibility over a relational database.  Some popular databases of this type are MongoDB, Cassandra and ElasticSearch.

Now that you've learned what a database is let's learn how we can actually talk to it using SQL.

**Answer the questions below**⸻⸻⸻⸻⸻

What is the acronym for the software that controls a database?
**Answer:** DBMS

What is the name of the grid-like structure which holds the data?
**Answer:** Table

⸻⸻⸻⸻⸻

### Task 3 What is SQL?

SQL (Structured Query Language) is a feature-rich language used for querying databases. These SQL queries are better referred to as statements.

The simplest of the commands which we'll cover in this task is used to retrieve (select), update, insert and delete data. Although somewhat similar, some database servers have their own syntax and slight changes to how things work. All of these examples are based on a MySQL database. After learning the lessons, you'll easily be able to search for alternative syntax online for the different servers. It's worth noting that SQL syntax is not case-sensitive.

**SELECT**
The first query type we'll learn is the SELECT query used to retrieve data from the database.

\`select * from users;\`

[table]
id | username | password
1 | jon | pass123
2 | admin | p4ssword
3 | martin | secret123
[/table]

The first word SELECT, tells the database we want to retrieve some data; the * tells the database we want to receive back all columns from the table. For example, the table may contain three columns (id, username and password). "from users" tells the database we want to retrieve the data from the table named users. Finally, the semicolon at the end tells the database that this is the end of the query.  

The next query is similar to the above, but this time, instead of using the * to return all columns in the database table, we are just requesting the username and password field.

\`select username,password from users;\`

[table]
username | password
jon | pass123
admin | p4ssword
martin | secret123
[/table]

The following query, like the first, returns all the columns by using the * selector, and then the "LIMIT 1" clause forces the database to return only one row of data. Changing the query to "LIMIT 1,1" forces the query to skip the first result, and then "LIMIT 2,1" skips the first two results, and so on. You need to remember the first number tells the database how many results you wish to skip, and the second number tells the database how many rows to return.

\`select * from users LIMIT 1;\`

[table]
id | username | password
1 | jon | pass123
[/table]

Lastly, we're going to utilise the where clause; this is how we can finely pick out the exact data we require by returning data that matches our specific clauses:

\`select * from users where username='admin';\`

[table]
id | username | password
2 | admin | p4ssword
[/table]

This will only return the rows where the username is equal to admin.

\`select * from users where username != 'admin';\`

[table]
id | username | password
1 | jon | pass123
3 | martin | secret123
[/table]

This will only return the rows where the username is **NOT** equal to admin.

\`select * from users where username='admin' or username='jon';\`

[table]
id | username | password
1 | jon | pass123
2 | admin | p4ssword
[/table]

This will only return the rows where the username is either equal to **admin** or **jon**. 


\`select * from users where username='admin' and password='p4ssword';\`

[table]
id | username | password
2 | admin | p4ssword
[/table]

This will only return the rows where the username is equal to** admin** and the password is equal to **p4ssword**.

Using the like clause allows you to specify data that isn't an exact match but instead either starts, contains or ends with certain characters by choosing where to place the wildcard character represented by a percentage sign %.

\`select * from users where username like 'a%';\`

[table]
id | username | password
2 | admin | p4ssword
[/table]

This returns any rows with a username beginning with the letter a.

\`select * from users where username like '%n';\`

[table]
id | username | password
1 | jon | pass123
2 | admin | p4ssword
3 | martin | secret123
[/table]

This returns any rows with a username ending with the letter n.

\`select * from users where username like '%mi%';\`

[table]
id | username | password
2 | admin | p4ssword
[/table]

This returns any rows with a username containing the characters **mi** within them.

**UNION**
The UNION statement combines the results of two or more SELECT statements to retrieve data from either single or multiple tables; the rules to this query are that the UNION statement must retrieve the same number of columns in each SELECT statement, the columns have to be of a similar data type, and the column order has to be the same. This might sound not very clear, so let's use the following analogy. Say a company wants to create a list of addresses for all customers and suppliers to post a new catalogue. We have one table called customers with the following contents:
[table]
id | name | address | city | postcode
1 | Mr John Smith | 123 Fake Street | Manchester | M2 3FJ
2 | Mrs Jenny Palmer | 99 Green Road | Birmingham | B2 4KL
3 | Miss Sarah Lewis | 15 Fore Street | London | NW12 3GH
[/table]

And another called suppliers with the following contents:
[table]
id | company | address | city | postcode
1 | Widgets Ltd | Unit 1a, Newby Estate | Bristol | BS19 4RT
2 | The Tool Company | 75 Industrial Road | Norwich | N22 3DR
3 | Axe Makers Ltd | 2b Makers Unit, Market Road | London | SE9 1KK
[/table]

Using the following SQL Statement, we can gather the results from the two tables and put them into one result set:

\`SELECT name,address,city,postcode from customers UNION SELECT company,address,city,postcode from suppliers;\`

[table]
name | address | city | postcode
Mr John Smith | 123 Fake Street | Manchester | M2 3FJ
Mrs Jenny Palmer | 99 Green Road | Birmingham | B2 4KL
Miss Sarah Lewis | 15 Fore Street | London | NW12 3GH
Widgets Ltd | Unit 1a, Newby Estate | Bristol | BS19 4RT
The Tool Company | 75 Industrial Road | Norwich | N22 3DR
Axe Makers Ltd | 2b Makers Unit, Market Road | London | SE9 1KK
[/table]

**INSERT**
The **INSERT** statement tells the database we wish to insert a new row of data into the table. "**into users**" tells the database which table we wish to insert the data into, "**(username,password)**" provides the columns we are providing data for and then "**values ('bob','password');**" provides the data for the previously specified columns.

\`insert into users (username,password) values ('bob','password123');\`

[table]
id | username | password
1 | jon | pass123
2 | admin | p4ssword
3 | martin | secret123
4 | bob | password123
[/table]

**UPDATE**
The **UPDATE** statement tells the database we wish to update one or more rows of data within a table. You specify the table you wish to update using "**update %tablename% SET**" and then select the field or fields you wish to update as a comma-separated list such as "**username='root',password='pass123'**" then finally, similar to the SELECT statement, you can specify exactly which rows to update using the where clause such as "**where username='admin;**".

\`update users SET username='root',password='pass123' where username='admin';\`

[table]
id | username | password
1 | jon | pass123
2 | root | pass123
3 | martin | secret123
4 | bob | password123
[/table]

**DELETE**
The **DELETE** statement tells the database we wish to delete one or more rows of data. Apart from missing the columns you wish to return, the format of this query is very similar to the SELECT. You can specify precisely which data to delete using the **where** clause and the number of rows to be deleted using the **LIMIT** clause.

\`delete from users where username='martin';\`

[table]
id | username | password
1 | jon | pass123
2 | root | pass123
4 | bob | password123
[/table]

\`delete from users;\`

Because no WHERE clause was being used in the query, all the data was deleted from the table.

[table]
id | username | password
[/table]

**Answer the questions below**⸻⸻⸻⸻⸻

What SQL statement is used to retrieve data?
**Answer:** SELECT

What SQL clause can be used to retrieve data from multiple tables?
**Answer:** UNION

What SQL statement is used to add data?
**Answer:** INSERT

⸻⸻⸻⸻⸻

### Task 4 What is SQL Injection?

**What is SQL Injection?**
The point wherein a web application using SQL can turn into SQL Injection is when user-provided data gets included in the SQL query.

**What does it look like?**
Take the following scenario where you've come across an online blog, and each blog entry has a unique ID number. The blog entries may be either set to public or private, depending on whether they're ready for public release. The URL for each blog entry may look something like this:

\`https://website.thm/blog?id=1\`

From the URL above, you can see that the blog entry selected comes from the id parameter in the query string. The web application needs to retrieve the article from the database and may use an SQL statement that looks something like the following:

\`SELECT * from blog where id=1 and private=0 LIMIT 1;\`

From what you've learned in the previous task, you should be able to work out that the SQL statement above is looking in the blog table for an article with the id number of 1 and the private column set to 0, which means it's able to be viewed by the public and limits the results to only one match.

As was mentioned at the start of this task, SQL Injection is introduced when user input is introduced into the database query. In this instance, the id parameter from the query string is used directly in the SQL query.

Let's pretend article ID 2 is still locked as private, so it cannot be viewed on the website. We could now instead call the URL:

\`https://website.thm/blog?id=2;--\`

Which would then, in turn, produce the SQL statement:

\`SELECT * from blog where id=2;-- and private=0 LIMIT 1;\`

**The semicolon in the URL signifies the end of the SQL statement, and the two dashes cause everything afterwards to be treated as a comment**. By doing this, you're just, in fact, running the query:

\`SELECT * from blog where id=2;--\` 

Which will return the article with an ID of 2 whether it is set to public or not.

This was just one example of an SQL Injection vulnerability of a type called In-Band SQL Injection; there are three types in total: In-Band, Blind and Out-of-Band, which we'll discuss over the following tasks.

**Answer the questions below**⸻⸻⸻⸻⸻

What character signifies the end of an SQL query?
**Answer:** ;

⸻⸻⸻⸻⸻

### Task 5 In-Band SQLi

**In-Band SQL Injection**
In-Band SQL Injection is the easiest type to detect and exploit; In-Band just refers to the same method of communication being used to exploit the vulnerability and also receive the results, for example, discovering an SQL Injection vulnerability on a website page and then being able to extract data from the database to the same page.

**Error-Based SQL Injection**
This type of SQL Injection is the most useful for easily obtaining information about the database structure, as error messages from the database are printed directly to the browser screen. This can often be used to enumerate a whole database.

**Union-Based SQL Injection**
This type of Injection utilises the SQL UNION operator alongside a SELECT statement to return additional results to the page. This method is the most common way of extracting large amounts of data via an SQL Injection vulnerability.

**Practical:**



















`
}