<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241201000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create user and exam tables';
    }

    public function up(Schema $schema): void
    {
        // Create user table
        $this->addSql('CREATE TABLE user (
            id INT AUTO_INCREMENT NOT NULL,
            email VARCHAR(180) NOT NULL UNIQUE,
            roles JSON NOT NULL,
            password VARCHAR(255) NOT NULL,
            PRIMARY KEY(id),
            UNIQUE INDEX UNIQ_8D93D649E7927C74 (email)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        // Create exam table
        $this->addSql('CREATE TABLE exam (
            id INT AUTO_INCREMENT NOT NULL,
            student_name VARCHAR(255) NOT NULL,
            location VARCHAR(255) DEFAULT NULL,
            date DATE DEFAULT NULL,
            time VARCHAR(8) DEFAULT NULL,
            status VARCHAR(50) NOT NULL,
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE exam');
        $this->addSql('DROP TABLE user');
    }
}