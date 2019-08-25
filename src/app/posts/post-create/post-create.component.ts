import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  post: Post;
  isPageLoading = false;
  form: FormGroup;
  imagePreview: string;
  private postMode = "create"; //Default Mode
  private postId: string;
  private authStatusSubscription: Subscription;

  constructor( //Injected Services
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() { //Initialisation Code
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(authStatus => {
        this.isPageLoading = false;
      });
    this.form = new FormGroup({ //Create New Form
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)] //Validate Title
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required], //Required Validator
        asyncValidators: [mimeType] //Validate Image
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) { //If Map Has An ID
        this.postMode = "edit"; //Edit Existing Post
        this.postId = paramMap.get("postId");
        this.isPageLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => { //Get Post
          this.isPageLoading = false;
          this.post = { //Create New Post Object
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({ //Update Changeable Values For Particular Post
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.postMode = "create"; //Otherwise Create Post
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string; //Render Image Preview
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isPageLoading = true;
    if (this.postMode === "create") {
      this.postsService.addPost( //Create Post With New Values
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost( //Update Existing Details On Post
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset(); //Reset Form After
  }

  ngOnDestroy() { //Clean Up
    this.authStatusSubscription.unsubscribe();
  }

}
