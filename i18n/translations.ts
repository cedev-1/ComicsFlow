// Système d'internationalisation simple

export type Language = 'fr' | 'en';

export interface Translations {
  // App header
  appTitle: string;
  editing: string;
  preview: string;
  editMode: string;
  readMode: string;
  pages: string;
  page: string;

  // Metadata
  metadata: string;
  projectTitle: string;
  author: string;
  description: string;
  projectWidth: string;
  globalBackgroundColor: string;
  createdAt: string;
  updatedAt: string;
  saveMetadata: string;
  cancel: string;
  editMetadata: string;
  untitledProject: string;
  anonymousAuthor: string;

  // Toolbar
  addBubble: string;
  addZone: string;
  zonesMode: string;
  bubblesMode: string;
  export: string;
  import: string;
  toggleSidebar: string;

  // Sections
  sections: string;
  section: string;
  addSection: string;
  sectionProperties: string;
  sectionHeight: string;
  deleteSection: string;
  selectSectionToEdit: string;
  layoutType: string;
  layoutFull: string;
  layoutSplitH: string;
  layoutSplitV: string;
  layoutGrid2x2: string;
  layoutManga3: string;
  layoutDynamic: string;

  // Sidebar - Zone properties
  zoneProperties: string;
  position: string;
  size: string;
  width: string;
  height: string;
  imageFit: string;
  cover: string;
  contain: string;
  fill: string;
  borderRadius: string;
  rotation: string;
  layer: string;
  deleteZone: string;
  selectZoneToEdit: string;

  // Comic Effect
  comicEffect: string;
  enableEffect: string;
  borderWidth: string;
  borderColor: string;
  shadowOffset: string;
  shadowColor: string;

  // Sidebar - Bubble properties
  bubbleProperties: string;
  bubbleType: string;
  speech: string;
  thought: string;
  shout: string;
  whisper: string;
  narrator: string;
  tailPosition: string;
  none: string;
  left: string;
  right: string;
  top: string;
  bottom: string;
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  fontWeight: string;
  normal: string;
  bold: string;
  fontStyle: string;
  italic: string;
  deleteBubble: string;
  selectBubbleToEdit: string;

  // Preview
  by: string;
  back: string;
  theEnd: string;
  reread: string;
  backToEditor: string;
  scrollToRead: string;

  // Placeholders & Image zone
  yourTitleHere: string;
  clickToAddImage: string;
  dragImageHere: string;
  clickOrDragImage: string;
  changeImage: string;
  removeImage: string;

  // Tooltips / Help
  doubleClickToEdit: string;
  doubleClickToAddBubble: string;
  pressDeleteToRemove: string;

  // Export Modal
  chooseExportFormat: string;
  websiteHtml: string;
  htmlDescription: string;
  projectJson: string;
  jsonDescription: string;
  exporting: string;
  exportButton: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    // App header
    appTitle: 'Éditeur Webtoon',
    editing: 'Édition',
    preview: 'Aperçu',
    editMode: 'Mode édition',
    readMode: 'Mode lecture',
    pages: 'pages',
    page: 'page',

    // Metadata
    metadata: 'Métadonnées',
    projectTitle: 'Titre du projet',
    author: 'Auteur',
    description: 'Description',
    projectWidth: 'Largeur du projet',
    globalBackgroundColor: 'Couleur de fond globale',
    createdAt: 'Créé le',
    updatedAt: 'Modifié le',
    saveMetadata: 'Enregistrer',
    cancel: 'Annuler',
    editMetadata: 'Modifier les infos',
    untitledProject: 'Projet sans titre',
    anonymousAuthor: 'Auteur anonyme',

    // Toolbar
    addBubble: 'Ajouter bulle',
    addZone: 'Ajouter zone',
    zonesMode: 'Zones',
    bubblesMode: 'Bulles',
    export: 'Exporter',
    import: 'Importer',
    toggleSidebar: 'Panneau latéral',

    // Sections
    sections: 'Sections',
    section: 'Section',
    addSection: 'Ajouter section',
    sectionProperties: 'Propriétés de la section',
    sectionHeight: 'Hauteur section',
    deleteSection: 'Supprimer la section',
    selectSectionToEdit: 'Sélectionnez une section pour modifier ses propriétés',
    layoutType: 'Type de mise en page',
    layoutFull: 'Pleine page',
    layoutSplitH: 'Deux colonnes',
    layoutSplitV: 'Deux lignes',
    layoutGrid2x2: 'Grille 2x2',
    layoutManga3: 'Manga 3 cases',
    layoutDynamic: 'Dynamique',

    // Sidebar - Zone properties
    zoneProperties: 'Propriétés de la zone',
    position: 'Position',
    size: 'Taille',
    width: 'Largeur',
    height: 'Hauteur',
    imageFit: 'Ajustement image',
    cover: 'Couvrir',
    contain: 'Contenir',
    fill: 'Remplir',
    borderRadius: 'Arrondi',
    rotation: 'Rotation',
    layer: 'Calque',
    deleteZone: 'Supprimer la zone',
    selectZoneToEdit: 'Sélectionnez une zone pour modifier ses propriétés',

    // Comic Effect
    comicEffect: 'Effet BD',
    enableEffect: 'Activer l\'effet',
    borderWidth: 'Épaisseur bordure',
    borderColor: 'Couleur bordure',
    shadowOffset: 'Décalage ombre',
    shadowColor: 'Couleur ombre',

    // Sidebar - Bubble properties
    bubbleProperties: 'Propriétés de la bulle',
    bubbleType: 'Type de bulle',
    speech: 'Dialogue',
    thought: 'Pensée',
    shout: 'Cri',
    whisper: 'Murmure',
    narrator: 'Narrateur',
    tailPosition: 'Position de la queue',
    none: 'Aucune',
    left: 'Gauche',
    right: 'Droite',
    top: 'Haut',
    bottom: 'Bas',
    backgroundColor: 'Couleur de fond',
    textColor: 'Couleur du texte',
    fontSize: 'Taille du texte',
    fontWeight: 'Épaisseur',
    normal: 'Normal',
    bold: 'Gras',
    fontStyle: 'Style',
    italic: 'Italique',
    deleteBubble: 'Supprimer la bulle',
    selectBubbleToEdit: 'Sélectionnez une bulle pour modifier ses propriétés',

    // Preview
    by: 'par',
    back: 'Retour',
    theEnd: 'Fin',
    reread: 'Relire',
    backToEditor: 'Retour à l\'éditeur',
    scrollToRead: 'Scrollez pour lire',

    // Placeholders
    yourTitleHere: 'Votre titre ici...',
    clickToAddImage: 'Cliquez pour ajouter une image',
    dragImageHere: 'Glissez une image ici',
    clickOrDragImage: 'Cliquez ou glissez une image',
    changeImage: 'Changer l\'image',
    removeImage: 'Supprimer l\'image',

    // Tooltips / Help
    doubleClickToEdit: 'Double-cliquez pour éditer',
    doubleClickToAddBubble: 'Double-cliquez pour ajouter une bulle',
    pressDeleteToRemove: 'Appuyez sur Suppr pour supprimer',

    // Export Modal
    chooseExportFormat: 'Choisissez le format d\'export pour votre BD',
    websiteHtml: 'Site Web (HTML)',
    htmlDescription: 'Fichier HTML autonome avec animations. Idéal pour héberger sur un site web.',
    projectJson: 'Projet (JSON)',
    jsonDescription: 'Sauvegarde complète du projet. Permet de le réimporter plus tard.',
    exporting: 'Export...',
    exportButton: 'Exporter',
  },

  en: {
    // App header
    appTitle: 'Webtoon Editor',
    editing: 'Edit',
    preview: 'Preview',
    editMode: 'Edit mode',
    readMode: 'Read mode',
    pages: 'pages',
    page: 'page',

    // Metadata
    metadata: 'Metadata',
    projectTitle: 'Project title',
    author: 'Author',
    description: 'Description',
    projectWidth: 'Project width',
    globalBackgroundColor: 'Global background color',
    createdAt: 'Created at',
    updatedAt: 'Updated at',
    saveMetadata: 'Save',
    cancel: 'Cancel',
    editMetadata: 'Edit info',
    untitledProject: 'Untitled project',
    anonymousAuthor: 'Anonymous author',

    // Toolbar
    addBubble: 'Add bubble',
    addZone: 'Add zone',
    zonesMode: 'Zones',
    bubblesMode: 'Bubbles',
    export: 'Export',
    import: 'Import',
    toggleSidebar: 'Toggle sidebar',

    // Sections
    sections: 'Sections',
    section: 'Section',
    addSection: 'Add section',
    sectionProperties: 'Section properties',
    sectionHeight: 'Section height',
    deleteSection: 'Delete section',
    selectSectionToEdit: 'Select a section to edit its properties',
    layoutType: 'Layout type',
    layoutFull: 'Full page',
    layoutSplitH: 'Two columns',
    layoutSplitV: 'Two rows',
    layoutGrid2x2: 'Grid 2x2',
    layoutManga3: 'Manga 3 panels',
    layoutDynamic: 'Dynamic',

    // Sidebar - Zone properties
    zoneProperties: 'Zone properties',
    position: 'Position',
    size: 'Size',
    width: 'Width',
    height: 'Height',
    imageFit: 'Image fit',
    cover: 'Cover',
    contain: 'Contain',
    fill: 'Fill',
    borderRadius: 'Border radius',
    rotation: 'Rotation',
    layer: 'Layer',
    deleteZone: 'Delete zone',
    selectZoneToEdit: 'Select a zone to edit its properties',

    // Comic Effect
    comicEffect: 'Comic effect',
    enableEffect: 'Enable effect',
    borderWidth: 'Border width',
    borderColor: 'Border color',
    shadowOffset: 'Shadow offset',
    shadowColor: 'Shadow color',

    // Sidebar - Bubble properties
    bubbleProperties: 'Bubble properties',
    bubbleType: 'Bubble type',
    speech: 'Speech',
    thought: 'Thought',
    shout: 'Shout',
    whisper: 'Whisper',
    narrator: 'Narrator',
    tailPosition: 'Tail position',
    none: 'None',
    left: 'Left',
    right: 'Right',
    top: 'Top',
    bottom: 'Bottom',
    backgroundColor: 'Background color',
    textColor: 'Text color',
    fontSize: 'Font size',
    fontWeight: 'Font weight',
    normal: 'Normal',
    bold: 'Bold',
    fontStyle: 'Font style',
    italic: 'Italic',
    deleteBubble: 'Delete bubble',
    selectBubbleToEdit: 'Select a bubble to edit its properties',

    // Preview
    by: 'by',
    back: 'Back',
    theEnd: 'The End',
    reread: 'Reread',
    backToEditor: 'Back to editor',
    scrollToRead: 'Scroll to read',

    // Placeholders
    yourTitleHere: 'Your title here...',
    clickToAddImage: 'Click to add an image',
    dragImageHere: 'Drag an image here',
    clickOrDragImage: 'Click or drag an image',
    changeImage: 'Change image',
    removeImage: 'Remove image',

    // Tooltips / Help
    doubleClickToEdit: 'Double-click to edit',
    doubleClickToAddBubble: 'Double-click to add a bubble',
    pressDeleteToRemove: 'Press Delete to remove',

    // Export Modal
    chooseExportFormat: 'Choose the export format for your comic',
    websiteHtml: 'Website (HTML)',
    htmlDescription: 'Standalone HTML file with animations. Ideal for hosting on a website.',
    projectJson: 'Project (JSON)',
    jsonDescription: 'Complete project backup. Allows reimporting later.',
    exporting: 'Exporting...',
    exportButton: 'Export',
  },
};

export const getBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'fr' ? 'fr' : 'en';
};
