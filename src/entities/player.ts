import { SPRITES } from "../utils/constants";
import { Entity } from "./entity";

export class Player extends Entity  {
    textureKey: string;
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture, SPRITES.PLAYER);

        const anims = this.scene.anims;
        const animsFrameRate = 9;
        this.textureKey = texture;

        anims.create({
            key: 'down',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 0,
                end: 2
            }),
            frameRate: animsFrameRate,
            repeat: -1
        })

        anims.create({
            key: 'left',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 12,
                end: 14
            }),
            frameRate: animsFrameRate,
            repeat: -1
        })

        anims.create({
            key: 'right',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 24,
                end: 26
            }),
            frameRate: animsFrameRate,
            repeat: -1
        })

        anims.create({
            key: 'up',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 36,
                end: 38
            }),
            frameRate: animsFrameRate,
            repeat: -1
        })
    }

    update(delta: number) {
        const keys = this.scene.input.keyboard.createCursorKeys();

        if (keys.up.isDown) {
            this.play('up', true);
            this.setPosition(this.x, this.y - delta * 0.25)
        } else if (keys.down.isDown) {
            this.play('down', true);
            this.setPosition(this.x, this.y + delta * 0.25)
        } else if (keys.left.isDown) {
            this.play('left', true);
            this.setPosition(this.x - delta * 0.25, this.y)
        } else if (keys.right.isDown) {
            this.play('right', true);
            this.setPosition(this.x + delta * 0.25, this.y)
        } else {
            this.stop();
        }
    }
}