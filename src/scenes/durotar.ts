import durotarJSON from '../assets/durotar.json';
import { Player } from '../entities/player';
import { LAYERS, SIZES, SPRITES, TILES } from '../utils/constants';

export class Durotar extends Phaser.Scene {
    private player?: Player;
    constructor() {
        super('DurotarScene');
    }

    preload () {
        this.load.image(TILES.DUROTAR, 'src/assets/durotar.png')
        this.load.tilemapTiledJSON('map', 'src/assets/durotar.json')
        this.load.spritesheet(SPRITES.PLAYER, 'src/assets/characters/alliance.png', {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGHT
        })
    }

    create () {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage(durotarJSON.tilesets[0].name, TILES.DUROTAR, SIZES.TILE, SIZES.TILE);
        const groundLayer = map.createLayer(LAYERS.GROUND, tileset, 0, 0);
        const wallsLayer = map.createLayer(LAYERS.WALLS, tileset, 0, 0);

        this.player = new Player(this, 400, 250, SPRITES.PLAYER);
    }

    update(_: number, delta: number): void {
        this.player.update(delta);
    }
}