<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241213000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create exam table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE exam (
            id INT AUTO_INCREMENT NOT NULL,
            student_name VARCHAR(255) NOT NULL,
            location VARCHAR(255) DEFAULT NULL,
            date DATE NOT NULL,
            time TIME NOT NULL,
            status VARCHAR(50) NOT NULL,
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE exam');
    }
}