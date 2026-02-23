<?php
declare(strict_types=1);

namespace OCA\GuitarTabViewer\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\StreamResponse;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\Files\IRootFolder;
use OCP\IRequest;
use OCP\IUserSession;

class ViewerController extends Controller {
    public function __construct(
        string $appName,
        IRequest $request,
        private IRootFolder $rootFolder,
        private IUserSession $userSession,
    ) {
        parent::__construct($appName, $request);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index(string $file = ''): TemplateResponse {
        return new TemplateResponse('guitartabviewer', 'viewer', ['file' => $file]);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     * @PublicPage
     */
    public function getSoundFont(): StreamResponse {
        $path = __DIR__ . '/../../soundfont/sonivox.sf2';
        $handle = fopen($path, 'rb');
        $response = new StreamResponse($handle);
        $response->addHeader('Content-Type', 'application/octet-stream');
        $response->addHeader('Content-Length', (string)filesize($path));
        $response->addHeader('Cache-Control', 'public, max-age=31536000');
        return $response;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function getFile(string $path = ''): StreamResponse|DataResponse {
        $user = $this->userSession->getUser();
        if ($user === null) {
            return new DataResponse(['error' => 'Not logged in'], 401);
        }
        try {
            $node = $this->rootFolder->getUserFolder($user->getUID())->get($path);
            if ($node->getType() !== \OCP\Files\FileInfo::TYPE_FILE) {
                return new DataResponse(['error' => 'Not a file'], 400);
            }
            $response = new StreamResponse($node->fopen('rb'));
            $response->addHeader('Content-Type', 'application/octet-stream');
            $response->addHeader('Content-Disposition', 'inline; filename="' . $node->getName() . '"');
            return $response;
        } catch (\Exception $e) {
            return new DataResponse(['error' => $e->getMessage()], 404);
        }
    }
}
