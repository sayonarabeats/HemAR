import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three';

// Store layout creator class
export class StoreLayout {
  constructor(scene, instantTrackerGroup) {
    this.scene = scene;
    this.instantTrackerGroup = instantTrackerGroup;
    this.storeModel = null;
    this.navigationArrows = {
      checkout: null,
      offers: null,
      sausage: null
    };
    this.textureLoader = new THREE.TextureLoader();
    this.departmentLabels = {};
  }

  // Create the complete store layout
  createStore() {
    // Create a store group to hold all elements
    const storeGroup = new THREE.Group();
    
    // Add floor
    this.addFloor(storeGroup);
    
    // Add walls
    this.addWalls(storeGroup);
    
    // Add departments
    this.addDepartments(storeGroup);
    
    // Add shelves and other store elements
    this.addShelves(storeGroup);
    
    // Add entrance and exit
    this.addEntranceAndExit(storeGroup);
    
    // Add store branding
    this.addStoreBranding(storeGroup);
    
    // Store the model reference
    this.storeModel = storeGroup;
    
    // Add to the tracker group
    this.instantTrackerGroup.add(storeGroup);
    
    // Hide initially until placed
    storeModel.visible = false;
    
    // Create navigation arrows
    this.createNavigationArrows();
    
    return storeGroup;
  }

  // Add floor to the store
  addFloor(storeGroup) {
    // Main floor
    const floorGeometry = new THREE.PlaneGeometry(12, 12);
    const floorTexture = this.textureLoader.load('assets/images/floor-texture.jpg');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(6, 6);
    
    const floorMaterial = new THREE.MeshBasicMaterial({ 
      map: floorTexture,
      side: THREE.DoubleSide
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -0.01; // Slightly below other elements to avoid z-fighting
    storeGroup.add(floor);
    
    // Add floor grid for better spatial awareness
    const gridHelper = new THREE.GridHelper(12, 12, 0x888888, 0xcccccc);
    gridHelper.position.y = 0.01;
    storeGroup.add(gridHelper);
  }

  // Add walls to the store
  addWalls(storeGroup) {
    const wallHeight = 3;
    const wallColor = 0xf0f0f0;
    const wallMaterial = new THREE.MeshBasicMaterial({ 
      color: wallColor,
      side: THREE.DoubleSide
    });
    
    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(12, wallHeight);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, wallHeight/2, -6);
    storeGroup.add(backWall);
    
    // Left wall
    const leftWallGeometry = new THREE.PlaneGeometry(12, wallHeight);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-6, wallHeight/2, 0);
    storeGroup.add(leftWall);
    
    // Right wall
    const rightWallGeometry = new THREE.PlaneGeometry(12, wallHeight);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(6, wallHeight/2, 0);
    storeGroup.add(rightWall);
    
    // Front wall (with entrance gap)
    const frontWallLeftGeometry = new THREE.PlaneGeometry(4, wallHeight);
    const frontWallLeft = new THREE.Mesh(frontWallLeftGeometry, wallMaterial);
    frontWallLeft.rotation.y = Math.PI;
    frontWallLeft.position.set(-4, wallHeight/2, 6);
    storeGroup.add(frontWallLeft);
    
    const frontWallRightGeometry = new THREE.PlaneGeometry(4, wallHeight);
    const frontWallRight = new THREE.Mesh(frontWallRightGeometry, wallMaterial);
    frontWallRight.rotation.y = Math.PI;
    frontWallRight.position.set(4, wallHeight/2, 6);
    storeGroup.add(frontWallRight);
    
    // Add Hema logo to back wall
    this.addWallLogo(storeGroup, backWall);
  }

  // Add Hema logo to wall
  addWallLogo(storeGroup, wall) {
    const logoTexture = this.textureLoader.load('assets/images/hema-logo.png');
    const logoMaterial = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const logoGeometry = new THREE.PlaneGeometry(2, 2);
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, 2, -5.95); // Slightly in front of back wall
    storeGroup.add(logo);
  }

  // Add departments to the store
  addDepartments(storeGroup) {
    // Checkout area (Kassa)
    const checkoutGeometry = new THREE.BoxGeometry(3, 1, 1.5);
    const checkoutMaterial = new THREE.MeshBasicMaterial({ color: 0xe60000 }); // Hema red
    const checkout = new THREE.Mesh(checkoutGeometry, checkoutMaterial);
    checkout.position.set(-4, 0.5, -4);
    storeGroup.add(checkout);
    
    // Create text for checkout
    this.createDepartmentLabel(checkout, 'KASSA / CHECKOUT', 0xffffff);
    this.departmentLabels.checkout = checkout;
    
    // Special offers area (Aanbiedingen)
    const offersGeometry = new THREE.BoxGeometry(4, 1.2, 2);
    const offersMaterial = new THREE.MeshBasicMaterial({ color: 0x003da5 }); // Hema blue
    const offers = new THREE.Mesh(offersGeometry, offersMaterial);
    offers.position.set(3, 0.6, -3);
    storeGroup.add(offers);
    
    // Create text for offers
    this.createDepartmentLabel(offers, 'AANBIEDINGEN / OFFERS', 0xffffff);
    this.departmentLabels.offers = offers;
    
    // Smoked sausage area (Rookworst)
    const sausageGeometry = new THREE.BoxGeometry(3, 1, 2);
    const sausageMaterial = new THREE.MeshBasicMaterial({ color: 0xe60000 }); // Hema red
    const sausage = new THREE.Mesh(sausageGeometry, sausageMaterial);
    sausage.position.set(0, 0.5, 3);
    storeGroup.add(sausage);
    
    // Create text for sausage
    this.createDepartmentLabel(sausage, 'ROOKWORST / SMOKED SAUSAGE', 0xffffff);
    this.departmentLabels.sausage = sausage;
  }

  // Create department label
  createDepartmentLabel(parent, text, color) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = 'bold 48px Arial';
    context.fillStyle = `rgba(${(color >> 16) & 255}, ${(color >> 8) & 255}, ${color & 255}, 1)`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const geometry = new THREE.PlaneGeometry(3, 0.75);
    const label = new THREE.Mesh(geometry, material);
    label.position.y = 1.5;
    label.rotation.x = -Math.PI / 8;
    
    parent.add(label);
    return label;
  }

  // Add shelves to the store
  addShelves(storeGroup) {
    const shelfGeometry = new THREE.BoxGeometry(1.5, 1.8, 0.8);
    const shelfMaterial = new THREE.MeshBasicMaterial({ color: 0x999999 });
    
    // Add shelves along the walls
    // Back wall shelves
    for (let x = -5; x <= 5; x += 2) {
      if (Math.abs(x) > 1) { // Skip center area for logo
        const backShelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        backShelf.position.set(x, 0.9, -5.5);
        storeGroup.add(backShelf);
      }
    }
    
    // Side wall shelves
    for (let z = -4; z <= 4; z += 2) {
      // Left wall shelves
      const leftShelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
      leftShelf.rotation.y = Math.PI / 2;
      leftShelf.position.set(-5.5, 0.9, z);
      storeGroup.add(leftShelf);
      
      // Right wall shelves
      const rightShelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
      rightShelf.rotation.y = Math.PI / 2;
      rightShelf.position.set(5.5, 0.9, z);
      storeGroup.add(rightShelf);
    }
    
    // Center island shelves
    const islandGeometry = new THREE.BoxGeometry(5, 1.2, 2);
    const islandMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
    const island = new THREE.Mesh(islandGeometry, islandMaterial);
    island.position.set(0, 0.6, 0);
    storeGroup.add(island);
    
    // Add products to shelves
    this.addProducts(storeGroup);
  }

  // Add products to shelves
  addProducts(storeGroup) {
    // Add some colorful product displays
    const productColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    
    // Products on island
    for (let x = -1.5; x <= 1.5; x += 0.75) {
      for (let z = -0.5; z <= 0.5; z += 0.5) {
        const productGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.4);
        const productMaterial = new THREE.MeshBasicMaterial({ 
          color: productColors[Math.floor(Math.random() * productColors.length)] 
        });
        const product = new THREE.Mesh(productGeometry, productMaterial);
        product.position.set(x, 1.35, z);
        storeGroup.add(product);
      }
    }
    
    // Products on wall shelves
    for (let x = -5; x <= 5; x += 2) {
      if (Math.abs(x) > 1) {
        for (let i = 0; i < 3; i++) {
          const productGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
          const productMaterial = new THREE.MeshBasicMaterial({ 
            color: productColors[Math.floor(Math.random() * productColors.length)] 
          });
          const product = new THREE.Mesh(productGeometry, productMaterial);
          product.position.set(x + (i * 0.4 - 0.4), 1.9, -5.3);
          storeGroup.add(product);
        }
      }
    }
  }

  // Add entrance and exit to the store
  addEntranceAndExit(storeGroup) {
    // Entrance sign
    const entranceGeometry = new THREE.PlaneGeometry(3, 0.8);
    const entranceCanvas = document.createElement('canvas');
    const entranceContext = entranceCanvas.getContext('2d');
    entranceCanvas.width = 512;
    entranceCanvas.height = 128;
    
    entranceContext.fillStyle = '#e60000'; // Hema red
    entranceContext.fillRect(0, 0, entranceCanvas.width, entranceCanvas.height);
    
    entranceContext.font = 'bold 48px Arial';
    entranceContext.fillStyle = 'white';
    entranceContext.textAlign = 'center';
    entranceContext.textBaseline = 'middle';
    entranceContext.fillText('ENTRANCE / INGANG', entranceCanvas.width / 2, entranceCanvas.height / 2);
    
    const entranceTexture = new THREE.CanvasTexture(entranceCanvas);
    const entranceMaterial = new THREE.MeshBasicMaterial({
      map: entranceTexture,
      side: THREE.DoubleSide
    });
    
    const entranceSign = new THREE.Mesh(entranceGeometry, entranceMaterial);
    entranceSign.position.set(0, 2.5, 5.9);
    entranceSign.rotation.y = Math.PI;
    storeGroup.add(entranceSign);
    
    // Floor entrance marker
    const entranceMarkerGeometry = new THREE.PlaneGeometry(4, 1);
    const entranceMarkerMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xe60000,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const entranceMarker = new THREE.Mesh(entranceMarkerGeometry, entranceMarkerMaterial);
    entranceMarker.rotation.x = Math.PI / 2;
    entranceMarker.position.set(0, 0.02, 5.5);
    storeGroup.add(entranceMarker);
  }

  // Add store branding elements
  addStoreBranding(storeGroup) {
    // Add ceiling signs
    this.addCeilingSigns(storeGroup);
    
    // Add floor decals
    this.addFloorDecals(storeGroup);
  }

  // Add ceiling signs
  addCeilingSigns(storeGroup) {
    // Main ceiling sign with Hema logo
    const ceilingSignGeometry = new THREE.PlaneGeometry(3, 1);
    const ceilingSignCanvas = document.createElement('canvas');
    const ceilingSignContext = ceilingSignCanvas.getContext('2d');
    ceilingSignCanvas.width = 512;
    ceilingSignCanvas.height = 170;
    
    ceilingSignContext.fillStyle = '#e60000'; // Hema red
    ceilingSignContext.fillRect(0, 0, ceilingSignCanvas.width, ceilingSignCanvas.height);
    
    ceilingSignContext.font = 'bold 100px Arial';
    ceilingSignContext.fillStyle = 'white';
    ceilingSignContext.textAlign = 'center';
    ceilingSignContext.textBaseline = 'middle';
    ceilingSignContext.fillText('HEMA', ceilingSignCanvas.width / 2, ceilingSignCanvas.height / 2);
    
    const ceilingSignTexture = new THREE.CanvasTexture(ceilingSignCanvas);
    const ceilingSignMaterial = new THREE.MeshBasicMaterial({
      map: ceilingSignTexture,
      side: THREE.DoubleSide
    });
    
    // Create double-sided sign
    const ceilingSign = new THREE.Mesh(ceilingSignGeometry, ceilingSignMaterial);
    ceilingSign.position.set(0, 2.5, 0);
    storeGroup.add(ceilingSign);
    
    // Department ceiling signs
    this.addDepartmentCeilingSign(storeGroup, 'KASSA / CHECKOUT', -4, 2.5, -4);
    this.addDepartmentCeilingSign(storeGroup, 'AANBIEDINGEN / OFFERS', 3, 2.5, -3);
    this.addDepartmentCeilingSign(storeGroup, 'ROOKWORST / SMOKED SAUSAGE', 0, 2.5, 3);
  }

  // Add department ceiling sign
  addDepartmentCeilingSign(storeGroup, text, x, y, z) {
    const signGeometry = new THREE.PlaneGeometry(2.5, 0.8);
    const signCanvas = document.createElement('canvas');
    const signContext = signCanvas.getContext('2d');
    signCanvas.width = 512;
    signCanvas.height = 170;
    
    signContext.fillStyle = '#003da5'; // Hema blue
    signContext.fillRect(0, 0, signCanvas.width, signCanvas.height);
    
    signContext.font = 'bold 40px Arial';
    signContext.fillStyle = 'white';
    signContext.textAlign = 'center';
    signContext.textBaseline = 'middle';
    signContext.fillText(text, signCanvas.width / 2, signCanvas.height / 2);
    
    const signTexture = new THREE.CanvasTexture(signCanvas);
    const signMaterial = new THREE.MeshBasicMaterial({
      map: signTexture,
      side: THREE.DoubleSide
    });
    
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(x, y, z);
    storeGroup.add(sign);
  }

  // Add floor decals
  addFloorDecals(storeGroup) {
    // Add Hema logo floor decal in center
    const floorDecalGeometry = new THREE.PlaneGeometry(3, 3);
    const floorDecalTexture = this.textureLoader.load('assets/images/hema-logo.png');
    const floorDecalMaterial = new THREE.MeshBasicMaterial({
      map: floorDecalTexture,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    
    const floorDecal = new THREE.Mesh(floorDecalGeometry, floorDecalMaterial);
    floorDecal.rotation.x = Math.PI / 2;
    floorDecal.position.set(0, 0.03, 0);
    storeGroup.add(floorDecal);
  }

  // Create navigation arrows for each department
  createNavigationArrows() {
    // Create arrows for checkout
    const checkoutArrows = this.createPathArrows(
      [
        new THREE.Vector3(0, 0.1, 0),
        new THREE.Vector3(-1, 0.1, -1),
        new THREE.Vector3(-2, 0.1, -2),
        new THREE.Vector3(-3, 0.1, -3),
        new THREE.Vector3(-4, 0.1, -4)
      ],
      0xe60000 // Hema red
    );
    this.navigationArrows.checkout = checkoutArrows;
    this.instantTrackerGroup.add(checkoutArrows);
    checkoutArrows.visible = false;
    
    // Create arrows for special offers
    const offersArrows = this.createPathArrows(
      [
        new THREE.Vector3(0, 0.1, 0),
        new THREE.Vector3(1, 0.1, -0.5),
        new THREE.Vector3(2, 0.1, -1.5),
        new THREE.Vector3(3, 0.1, -2.5)
      ],
      0xe60000 // Hema red
    );
    this.navigationArrows.offers = offersArrows;
    this.instantTrackerGroup.add(offersArrows);
    offersArrows.visible = false;
    
    // Create arrows for smoked sausage
    const sausageArrows = this.createPathArrows(
      [
        new THREE.Vector3(0, 0.1, 0),
        new THREE.Vector3(0, 0.1, 1),
        new THREE.Vector3(0, 0.1, 2),
        new THREE.Vector3(0, 0.1, 3)
      ],
      0xe60000 // Hema red
    );
    this.navigationArrows.sausage = sausageArrows;
    this.instantTrackerGroup.add(sausageArrows);
    sausageArrows.visible = false;
  }

  // Create path arrows
  createPathArrows(points, color) {
    const arrowGroup = new THREE.Group();
    
    // Create arrow geometry
    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(0, 0.3);
    arrowShape.lineTo(0.15, 0);
    arrowShape.lineTo(0.05, 0);
    arrowShape.lineTo(0.05, -0.3);
    arrowShape.lineTo(-0.05, -0.3);
    arrowShape.lineTo(-0.05, 0);
    arrowShape.lineTo(-0.15, 0);
    arrowShape.lineTo(0, 0.3);
    
    const extrudeSettings = {
      steps: 1,
      depth: 0.05,
      bevelEnabled: false
    };
    
    const arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: color });
    
    // Create arrows along the path
    for (let i = 0; i < points.length; i++) {
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.position.copy(points[i]);
      
      // Orient arrow to point to the next point or in the last direction
      if (i < points.length - 1) {
        const direction = new THREE.Vector3().subVectors(points[i + 1], points[i]);
        const angle = Math.atan2(direction.x, direction.z);
        arrow.rotation.y = angle;
      } else if (i > 0) {
        const direction = new THREE.Vector3().subVectors(points[i], points[i - 1]);
        const angle = Math.atan2(direction.x, direction.z);
        arrow.rotation.y = angle;
      }
      
      // Add pulsing animation data
      arrow.userData = {
        originalY: points[i].y,
        pulsePhase: i * (Math.PI / 4) // Offset phase for each arrow
      };
      
      arrowGroup.add(arrow);
    }
    
    return arrowGroup;
  }

  // Update navigation arrows (for animations)
  updateNavigationArrows(time) {
    // Update all visible navigation arrows
    Object.values(this.navigationArrows).forEach(arrowGroup => {
      if (arrowGroup && arrowGroup.visible) {
        // Animate each arrow in the group
        arrowGroup.children.forEach((arrow, index) => {
          // Floating animation
          const floatOffset = Math.sin(time * 2 + arrow.userData.pulsePhase) * 0.05;
          arrow.position.y = arrow.userData.originalY + floatOffset;
          
          // Pulsing scale animation
          const scale = 1 + Math.sin(time * 3 + arrow.userData.pulsePhase) * 0.1;
          arrow.scale.set(scale, scale, scale);
        });
      }
    });
  }

  // Show navigation arrows for a specific destination
  showNavigationTo(destination) {
    // Hide all navigation arrows
    Object.values(this.navigationArrows).forEach(arrow => {
      if (arrow) arrow.visible = false;
    });
    
    // Show selected destination arrows
    if (this.navigationArrows[destination]) {
      this.navigationArrows[destination].visible = true;
      
      // Highlight the destination department
      this.highlightDepartment(destination);
    }
  }

  // Highlight a department
  highlightDepartment(department) {
    // Reset all departments
    Object.keys(this.departmentLabels).forEach(key => {
      const label = this.departmentLabels[key];
      if (label) {
        label.material.emissive = new THREE.Color(0x000000);
        label.material.emissiveIntensity = 0;
      }
    });
    
    // Highlight selected department
    if (this.departmentLabels[department]) {
      this.departmentLabels[department].material.emissive = new THREE.Color(0xffff00);
      this.departmentLabels[department].material.emissiveIntensity = 0.5;
    }
  }
}
