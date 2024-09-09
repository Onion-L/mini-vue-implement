/* eslint-disable no-undef */
import { createRenderer } from "../../dist/mini-vue-implement.esm.js"
import { App } from "./App.js"

const rootContainer = document.querySelector("#app")

console.log(PIXI)

// 首先创建一个 PIXI 应用实例
async function initGame() {
	const game = new PIXI.Application()

	await game.init({
		width: 800,
		height: 600,
		backgroundColor: 0x1099bb,
		resizeTo: window,
		autoStart: false // 防止自动开始渲染
	})

	// 确保应用程序已经完全初始化
	await game.start()

	// 现在应该可以安全地访问 canvas 了
	if (game.canvas) {
		document.body.appendChild(game.canvas)
	} else {
		console.error("Canvas is still undefined")
	}

	return game
}

// 使用异步函数初始化游戏
initGame()
	.then((game) => {
		// 这里可以进行其他初始化操作
		const renderer = createRenderer({
			createElement(type) {
				if (type === "rect") {
					const rect = new PIXI.Graphics()
					rect.beginFill(0xff0000)
					rect.drawRect(0, 0, 100, 100)
					rect.endFill()
					return rect
				}
				// 为其他类型的元素添加处理逻辑
				console.warn(`Unhandled element type: ${type}`)
				return new PIXI.Container() // 默认返回一个容器
			},
			patchProps(el, key, value) {
				if (key === "x" || key === "y") {
					el.position[key] = value
				} else {
					el[key] = value
				}
			},
			insert(el, parent) {
				if (parent instanceof PIXI.Container) {
					parent.addChild(el)
				} else if (parent === rootContainer) {
					// 如果父元素是根容器，将元素添加到 PIXI 应用的舞台
					game.stage.addChild(el)
				} else {
					console.error("Invalid parent:", parent)
				}
			}
		})

		// 创建一个 PIXI 容器作为根元素
		const pixiRoot = new PIXI.Container()
		game.stage.addChild(pixiRoot)

		renderer.createApp(App).mount(pixiRoot)
	})
	.catch((error) => {
		console.error("Failed to initialize game:", error)
	})
