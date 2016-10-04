import { AbstractChart, sizeType } from './charts';
import { Canvas } from 'canvas';
export wordDataType = {text:string, size:number};

abstract class AbstractCloudChart extends AbstractChart {
    abstract words:wordDataType[];
    wordPadding:number=10;
    wordRotation:number=0;
    wordFont:string='Arial';

    initChart(){
        this.cloud = cloud()
            .size(this.getSize())
            .canvas(=> new Canvas(1,1))
            .padding(this.wordPadding)
            .rotate(this.wordRotation)
            .font(this.wordFont)
            .fontSize((d)=>d.size);
    }

    getSize():sizeType{
        let parent = this.chartElement.nativeElement.parentNode;
        let bbox = parent.getBoundingClientRect();
        return { width: parent.width, height: parent.width * 0.7 };
    }

}
