INSERT INTO department (name)
     VALUES ("Kanto"),
            ("Johto"),
            ("Hoenn"),
            ("Sinnoh"),
            ("Unova");

INSERT INTO role (title, salary, department_id)
     VALUES ("Rocket Grunt", 30690.00, 1),
            ("Rocket Executive", 67500.00, 1),
            ("Rocket Boss", 82800.00, 1),
            ("Elite Four", 76800.00, 2),
            ("Champion", 150000.00, 2),
            ("Dragon Tamer", 88000.00, 3),
            ("Dragon Master", 120000.00, 3),
            ("Ace Trainer", 52800.00, 4),
            ("Diamond Teacher", 89280.00, 4),
            ("Beauty", 89100.00, 5),
            ("Shining Model", 115200.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
     VALUES ("Giovanni", "Sakaki", 3, NULL),
            ("Lance", "Proton", 2, 1),
            ("Lambda", "Petrel", 2, 1),
            ("Athena", "Ariana", 2, 1),
            ("Apollo", "Archer", 2, 1),
            ("Jessie", "Mushashi", 1, 1),
            ("James", "Kojiro", 1, 1),
            ("Lance", "Fusube", 5, NULL),
            ("Will", "Natio", 4, 8),
            ("Karen", "Blacki", 4, 8),
            ("Drake", "Bohmander", 7, NULL),
            ("Aaron", "Kairyu", 6, 11),
            ("Dray", "Tyltalis", 6, 11),
            ("Egon", "Hyporoi", 6, 11),
            ("Nicolas", "Libegon", 6, 11),
            ("Candice", "Kissaki", 9, NULL),
            ("Sergio", "Nyula", 8, 16),
            ("Brenna", "Yukikaburi", 8, 16),
            ("Elesa", "Raimon", 11, NULL),
            ("Nikola", "Mokoko", 10, 19),
            ("Fleming", "Shimama", 10, 19),
            ("Ampere", "Elekid", 10, 19);

SELECT *
  FROM department;

SELECT *
  FROM role;

SELECT *
  FROM employee;
