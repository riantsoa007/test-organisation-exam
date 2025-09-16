<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Change time column from datetime to string format
 */
final class Version20250913000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Change time column from datetime to string (HH:MM format)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE exam MODIFY time VARCHAR(8) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE exam MODIFY time TIME NOT NULL');
    }
}