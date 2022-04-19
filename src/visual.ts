"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import IVisualHost = powerbi.extensibility.IVisualHost;

import { VisualSettings } from "./settings";
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;

import * as d3 from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export class Visual implements IVisual {
  private host: IVisualHost;
  private svg: Selection<SVGElement>;
  private container: Selection<SVGElement>;
  private circle: Selection<SVGElement>;
  private textValue: Selection<SVGElement>;
  private textLabel: Selection<SVGElement>;

  private visualSettings: VisualSettings;

  constructor(options: VisualConstructorOptions) {
    this.svg = d3
      .select(options.element)
      .append("svg")
      .classed("circleCard", true);
    this.container = this.svg.append("g").classed("container", true);
    this.circle = this.container.append("circle").classed("circle", true);
    this.textValue = this.container.append("text").classed("textValue", true);
    this.textLabel = this.container.append("text").classed("textLabel", true);
  }

  /**
   *
   * @param options
   * @returns
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstanceEnumeration {
    const settings: VisualSettings =
      this.visualSettings || <VisualSettings>VisualSettings.getDefault();
    return VisualSettings.enumerateObjectInstances(settings, options);
  }

  /**
   *
   * @param options
   */
  public update(options: VisualUpdateOptions) {
    let dataView: DataView = options.dataViews[0];

    let width: number = options.viewport.width;
    let height: number = options.viewport.height;
    this.svg.attr("width", width);
    this.svg.attr("height", height);
    let radius: number = Math.min(width, height) / 2.2;

    this.visualSettings = VisualSettings.parse<VisualSettings>(dataView);

    this.visualSettings.circle.circleThickness = Math.max(
      0,
      this.visualSettings.circle.circleThickness
    );
    this.visualSettings.circle.circleThickness = Math.min(
      10,
      this.visualSettings.circle.circleThickness
    );

    /**/
    this.circle
      .style("fill", this.visualSettings.circle.circleColor)
      .style("fill-opacity", 0.5)
      .style("stroke", "black")
      .style("stroke-width", this.visualSettings.circle.circleThickness)
      .attr("r", radius)
      .attr("cx", width / 2)
      .attr("cy", height / 2);

    /**/
    let fontSizeValue: number = Math.min(width, height) / 5;
    this.textValue
      .text(<string>dataView.single.value)
      .attr("x", "50%")
      .attr("y", "50%")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("font-size", fontSizeValue + "px");

    /**/
    let fontSizeLabel: number = fontSizeValue / 4;
    this.textLabel
      .text(dataView.metadata.columns[0].displayName)
      .attr("x", "50%")
      .attr("y", height / 2)
      .attr("dy", fontSizeValue / 1.2)
      .attr("text-anchor", "middle")
      .style("font-size", fontSizeLabel + "px");
  }
}
