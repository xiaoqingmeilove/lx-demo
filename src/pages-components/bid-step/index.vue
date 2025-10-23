<template>
	<div class="steps-box" :style="{ '--step-icon-size': iconSize + 'px' }">
		<el-steps :active="Number(step)" process-status="finish" align-center>
			<el-step
				v-for="(s, idx) in steps"
				:key="s.key"
				:title="s.title"
				class="has-custom-icon"
			>
				<template slot="icon">
					<img :src="getIconSrc(s, idx)" class="step-img" :style="{ width: iconSize + 'px', height: iconSize + 'px' }" />
				</template>
			</el-step>
		</el-steps>
	</div>
</template>

<script>
export default {
	name: 'bidStep',
	props: {
		// 当前进度（与 el-steps 的 active 对齐，通常 0 基）
		step: {
			type: [Number, String],
			default: 0
		},
		// 图标尺寸
		iconSize: {
			type: Number,
			default: 24
		},
        imagesBase: {
			type: String,
			default: () => `${process.env.BASE_URL}images/biddingManagement`
		},
		// 当前节点是否也显示为“点亮”状态（两状态：true=点亮，false=熄灭）
		currentAsOn: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			// 每个节点的 key 用来拼图片名
			steps: [
				{ title: '招标立项', key: 'project' },
				{ title: '报名中', key: 'signup' },
				{ title: '供应商入围', key: 'shortlist' },
				{ title: '标书编制', key: 'document' },
				{ title: '发标', key: 'issue' },
				{ title: '答疑', key: 'qa' },
				{ title: '投标', key: 'bid' },
				{ title: '开标', key: 'open' },
				{ title: '评标', key: 'review' },
				{ title: '定标', key: 'award' }
			]
		}
	},
	methods: {
		isOn(index) {
			const active = Number(this.step) || 0
			// 小于 active 的为已完成；是否包含当前节点由 currentAsOn 控制
			return this.currentAsOn ? index <= active : index < active
		},
		getIconSrc(stepItem, index) {
			const state = this.isOn(index) ? 'on' : 'off'
			return `${this.imagesBase}/${stepItem.key}_${state}.png`
		},
		getStepStyle(index, stepItem) {
			const icon = this.getIconSrc(stepItem, index)
			return {
				'--step-icon': `url(${icon})`,
				'--step-icon-size': `${this.iconSize}px`
			}
		}
	}
}
</script>
<style lang="less" scoped>
.steps-box{
	padding: 20px 0;
}

/* 取消默认圆形边框和背景，避免遮挡连线 */
.has-custom-icon /deep/ .el-step__icon {
	border: none;
	background: transparent;
	width: var(--step-icon-size, 24px);
	height: var(--step-icon-size, 24px);
}

/* 让连线垂直居中到图标中心，并保证可见厚度与默认颜色 */
.has-custom-icon /deep/ .el-step__line {
	top: calc(var(--step-icon-size, 24px) / 2);
	height: 1px;
	background-color: #e4e7ed;
}

/* 已完成/进行中的连线颜色（可按需替换主题色） */
.has-custom-icon /deep/ .is-finish .el-step__line,
.has-custom-icon /deep/ .is-process .el-step__line {
	background-color: #409EFF;
}

/* 兼容不同版本的 inner 实现，避免被边框样式覆盖 */
.has-custom-icon /deep/ .el-step__line-inner {
	border-width: 0;
	background-color: inherit;
}
</style>