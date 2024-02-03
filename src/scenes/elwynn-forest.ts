import elwynnForestJSON from '../assets/elwynn.json';
import { Player } from '../entities/player';
import { LAYERS, SIZES, SPRITES, TILES } from '../utils/constants';

export class ElwynnForest extends Phaser.Scene {
    private player?: Player;
    constructor() {
        super('ElwynnForestScene');
    }

    preload () {
        this.load.image(TILES.ELWYNN, 'src/assets/summer_tiles.png')
        this.load.tilemapTiledJSON('map', 'src/assets/elwynn.json')
        this.load.spritesheet(SPRITES.PLAYER, 'src/assets/characters/alliance.png', {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGHT
        })
    }

    create () {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage(elwynnForestJSON.tilesets[0].name, TILES.ELWYNN, SIZES.TILE, SIZES.TILE);
        const groundLayer = map.createLayer(LAYERS.GROUND, tileset, 0, 0);
        const wallsLayer = map.createLayer(LAYERS.WALLS, tileset, 0, 0);

        this.player = new Player(this, 400, 250, SPRITES.PLAYER);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, wallsLayer);
        wallsLayer.setCollisionByExclusion([-1]);
    }

    update(_: number, delta: number): void {
        this.player.update(delta);
    }
}