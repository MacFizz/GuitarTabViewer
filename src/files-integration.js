import { registerFileAction, DefaultType } from '@nextcloud/files'

const SUPPORTED_EXTENSIONS = ['gp', 'gp3', 'gp4', 'gp5', 'gpx', 'gp7']

function isGuitarProFile(node) {
    const ext = (node.basename || '').split('.').pop().toLowerCase()
    return SUPPORTED_EXTENSIONS.includes(ext)
}

function openInOverlay(url) {
    // Créer l'overlay
    const overlay = document.createElement('div')
    overlay.id = 'guitartab-viewer-overlay'
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        flex-direction: column;
    `

    // Créer l'iframe
    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        flex: 1;
    `

    overlay.appendChild(iframe)
    document.body.appendChild(overlay)

    // Écouter les messages de l'iframe pour la fermeture
    window.addEventListener('message', function closeHandler(event) {
        if (event.data === 'guitartab:close') {
            overlay.remove()
            window.removeEventListener('message', closeHandler)
        }
    })

    // Fermer avec Échap
    function escHandler(e) {
        if (e.key === 'Escape') {
            overlay.remove()
            document.removeEventListener('keydown', escHandler)
        }
    }
    document.addEventListener('keydown', escHandler)
}

registerFileAction({
    id: 'guitartabviewer--open',
    displayName: () => 'Open in Guitar Tab Viewer',
    iconSvgInline: () => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M21,3V15.5A3.5,3.5 0 0,1 17.5,19A3.5,3.5 0 0,1 14,15.5A3.5,3.5 0 0,1 17.5,12C18.04,12 18.55,12.12 19,12.34V6.47L9,8.6V17.5A3.5,3.5 0 0,1 5.5,21A3.5,3.5 0 0,1 2,17.5A3.5,3.5 0 0,1 5.5,14C6.04,14 6.55,14.12 7,14.34V6L21,3Z"/></svg>',
    default: DefaultType.DEFAULT,
    order: -1000,
    enabled(nodes) {
        if (!Array.isArray(nodes) || nodes.length !== 1) return false
        return isGuitarProFile(nodes[0])
    },
    async exec(node) {
        const url = OC.generateUrl('/apps/guitartabviewer/') + '?file=' + encodeURIComponent(node.path)
        openInOverlay(url)
        return null
    },
})

console.info('[GuitarTabViewer] File action registered ✓')
