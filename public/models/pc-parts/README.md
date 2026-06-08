# PC Part Sketchfab Models

Download each Sketchfab model as **glTF** when possible, then place the extracted files in these folders:

```text
public/models/pc-parts/case/scene.gltf
public/models/pc-parts/motherboard/scene.gltf
public/models/pc-parts/cpu/scene.gltf
public/models/pc-parts/cooler/scene.gltf
public/models/pc-parts/ram/scene.gltf
public/models/pc-parts/storage/scene.gltf
public/models/pc-parts/psu/scene.gltf
public/models/pc-parts/gpu/scene.gltf
```

Keep each model's related `.bin` file and `textures` folder beside its `scene.gltf`.

Example:

```text
public/models/pc-parts/ram/scene.gltf
public/models/pc-parts/ram/scene.bin
public/models/pc-parts/ram/textures/*
```

The simulator uses the real Sketchfab model when the file exists. If a part model is missing, it automatically keeps using the built-in fallback shape.
