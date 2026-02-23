<?php
declare(strict_types=1);

namespace OCA\GuitarTabViewer\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\Util;

class Application extends App implements IBootstrap {
    public const APP_ID = 'guitartabviewer';

    public function __construct() {
        parent::__construct(self::APP_ID);
    }

    public function register(IRegistrationContext $context): void {}

    public function boot(IBootContext $context): void {
        // Charge le script TOUJOURS, sans condition
        // (c'est ce que font les apps Nextcloud officielles)
        Util::addScript(self::APP_ID, 'guitartabviewer-files-integration');
    }
}
