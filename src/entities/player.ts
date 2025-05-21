import { SPRITES } from "../utils/constants";
import { Entity } from "./entity";

type SpriteType = {
    [key: string]: string;
    base: string;
    fight?: string;
}

export class Player extends Entity  {
    textureKey: string;
    private moveSpeed: number;
    enemies: Entity[];
    target: Entity;
    private isAttacking: boolean;
    playerHealthBar: any;
    enemyHealthBar: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: SpriteType) {
        super(scene, x, y, texture.base, SPRITES.PLAYER.base);

        const anims = this.scene.anims;
        const animsFrameRate = 9;
        this.moveSpeed = 50;
        this.setSize(28, 32);
        this.setOffset(10, 16);
        this.setScale(0.8);

        this.setupKeysListeners();
        this.createAnimation('down', texture.base, 0, 2, anims, animsFrameRate);
        this.createAnimation('left', texture.base, 12, 14, anims, animsFrameRate);
        this.createAnimation('right', texture.base, 24, 26, anims, animsFrameRate);
        this.createAnimation('up', texture.base, 36, 38, anims, animsFrameRate);
        this.createAnimation('fight', texture.fight, 3, 6, anims, animsFrameRate, 0);
        this.drawPlayerHealthBar();
        this.on('animationcomplete', () => {
            this.isAttacking = false;
        })
    }

    private createAnimation (
        key: string,
        textureKey: string,
        start: number,
        end: number,
        anims: Phaser.Animations.AnimationManager,
        frameRate: number,
        repeat: number = -1
    ) {
        anims.create({
            key,
            frames: anims.generateFrameNumbers(textureKey, {
                start,
                end
            }),
            frameRate,
            repeat
        })
    }

    private drawPlayerHealthBar() {
        this.playerHealthBar = this.scene.add.graphics();
        this.playerHealthBar.setScrollFactor(0);
        this.drawHealthBar(this.playerHealthBar, 10, 10, this.health / 100)
    }

    private drawEnemyHealthBar(target) {
        this.enemyHealthBar = this.scene.add.graphics();
        this.enemyHealthBar.setScrollFactor(0);
        this.drawHealthBar(this.playerHealthBar, 10, 30, target.health / 100)
    }

    private drawHealthBar(graphics, x, y, percentage) {
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(x, y, 100, 10)

        graphics.fillStyle(0x00ff00, 1);
        graphics.fillRect(x, y, 100 * percentage, 10)
    }

    setEnemies(enemies: Entity[]) {
        this.enemies = enemies;
    }

    private findTarget (enemies: Entity[]) {
        let target = null;
        let minDistance = Infinity;

        for (const enemy of enemies) {
            const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);

            if (distanceToEnemy < minDistance) {
                minDistance = distanceToEnemy;
                target = enemy;
            }
        }
        return target;
    }

    private setupKeysListeners() {
        this.scene.input.keyboard.on('keydown-SPACE', () => {
            this.isAttacking = true;
            const target = this.findTarget(this.enemies);
            this.play('fight');
            this.setVelocity(0,0);
            this.attack(target)
            this.drawEnemyHealthBar(target);
        })
    }

    attack (target: Entity) {
        const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

        if (distanceToEnemy < 50) {
            target.takeDamage(25);
        }
    }

    update(delta: number) {
        const keys = this.scene.input.keyboard.createCursorKeys();
        this.drawPlayerHealthBar();

        if (keys.up.isDown) {
            this.play('up', true);
            this.setVelocity(0, -delta * this.moveSpeed)
        } else if (keys.down.isDown) {
            this.play('down', true);
            this.setVelocity(0, delta * this.moveSpeed)
        } else if (keys.left.isDown) {
            this.play('left', true);
            this.setVelocity(-delta * this.moveSpeed, 0)
        } else if (keys.right.isDown) {
            this.play('right', true);
            this.setVelocity(delta * this.moveSpeed, 0)
        } else if (this.isAttacking) {
            this.setVelocity(0, 0);
        } else {
            this.setVelocity(0, 0);
            this.stop();
        }
    }
}