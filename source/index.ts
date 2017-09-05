import { Readable } from 'stream';

export interface RandomReadableStreamOptions<R> {
  errorRate: number;
  exampleDocuments: R[];
  size: number;
}

export class RandomReadableStream<R> extends Readable {
  private documentRead: number = 0;
  private options: RandomReadableStreamOptions<R>;

  constructor(options: RandomReadableStreamOptions<R>) {
    super({
      objectMode: true
    });

    // check the validity of the options
    if (options.errorRate < 0 || options.errorRate > 1) {
      throw new Error('The error rate mush be between 0 and 1.');
    }

    if (!options.exampleDocuments.length) {
      throw new Error('Do not forget to supply some example documents.');
    }

    // passing the options to the internal oneA
    this.options = options;

    // tell the downstream that the strea is ready to be read
    this.readable = true;
    this.emit('readable');
  }

  public _read(): void {
    if (Math.random() < this.options.errorRate) {
      // emit error at the specified rate
      this.emit('error', 'random error');
    } else if (this.documentRead < this.options.size) {
      this.pushDocument();
    } else {
      // finish the stream when the specified number of documents has been read
      this.readable = false;
      this.emit('end');
    }
  }

  private pushDocument(): void {
    // push a random document
    this.push(
      this.options.exampleDocuments[
        this.documentRead % this.options.exampleDocuments.length
      ]
    );
    this.documentRead++;
  }
}

export default RandomReadableStream;
