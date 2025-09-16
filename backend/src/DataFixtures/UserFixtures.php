<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Create initial users for the application
 * Loads test admin user with hashed password
 */

class UserFixtures extends Fixture
{
    private $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Clear existing users
        $connection = $manager->getConnection();
        $connection->executeStatement('DELETE FROM user');

        // Create admin user
        $user = new User();
        $user->setEmail('admin@example.com');
        $user->setRoles(['ROLE_USER', 'ROLE_ADMIN']);

        $hashedPassword = $this->passwordHasher->hashPassword($user, 'password');
        $user->setPassword($hashedPassword);

        $manager->persist($user);
        $manager->flush();

        echo "Admin user created: admin@example.com / password\n";
    }
}