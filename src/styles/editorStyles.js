export const richEditorStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 18px;
    line-height: 1.5;
    padding: 0.3rem 1rem;
  }
  @media (max-width: 768px) {
    body { font-size: 16px; }
  }
  .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
    margin-top: 0;
    font-size: 18px;
    position: absolute;
    top: 0.3rem;
    left: 1rem;
    color: #999;
    padding: 0;
  }
  .tox-edit-area__iframe {
    background: transparent !important;
  }
  .tox .tox-edit-area__iframe {
    border-color: var(--chakra-colors-brand-accent) !important;
  }
  .tox .tox-sidebar-wrap {
    border-color: var(--chakra-colors-brand-accent) !important;
  }
  p {
    margin: 0 !important;
    padding: 0 !important;
  }
  body p:first-child {
    margin-top: 0 !important;
    padding-left: 0 !important;
  }
  .mce-content-body p {
    margin-left: 0 !important;
    padding-left: 0 !important;
  }
  body {
    padding-left: 0 !important;
  }
`; 